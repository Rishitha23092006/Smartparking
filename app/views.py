from django.shortcuts import render, get_object_or_404
from .models import ParkingLot, Vehicle, ParkingEntry
from .serializers import (
    ParkingLotSerializer,
    VehicleSerializer,
    ParkingEntrySerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import render

def home(request):
    return render(request, "home.html")

@api_view(['GET'])
@permission_classes([AllowAny])
def available_slots(request):
    busy_slots = ParkingEntry.objects.filter(
        exit_time__isnull=True
    ).values_list('slot_id', flat=True)

    slots = ParkingLot.objects.exclude(id__in=busy_slots)
    serializer = ParkingLotSerializer(slots, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_vehicle(request):
    serializer = VehicleSerializer(data=request.data)
    if serializer.is_valid():
        vehicle = serializer.save(user=request.user)
        
        # Find first available slot
        busy_slots = ParkingEntry.objects.filter(
            exit_time__isnull=True
        ).values_list('slot_id', flat=True)
        
        available_slot = ParkingLot.objects.exclude(id__in=busy_slots).first()
        
        if available_slot:
            # Create parking entry for the vehicle in the available slot
            parking_entry = ParkingEntry.objects.create(
                slot=available_slot,
                vehicle=vehicle
            )
            return Response({
                "msg": "Vehicle added and parked successfully",
                "vehicle": VehicleSerializer(vehicle).data,
                "assigned_slot": {
                    "id": available_slot.id,
                    "location": available_slot.location
                },
                "parking_entry_id": parking_entry.id
            }, status=201)
        else:
            return Response({
                "msg": "Vehicle added but no slots available",
                "vehicle": VehicleSerializer(vehicle).data,
                "assigned_slot": None
            }, status=201)
    
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_vehicles(request):
    vehicles = Vehicle.objects.filter(user=request.user)
    serializer = VehicleSerializer(vehicles, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def park(request):
    slot_id = request.data.get('slot')
    vehicle_id = request.data.get('vehicle')

    if not slot_id or not vehicle_id:
        return Response({"error": "slot and vehicle are required"}, status=400)

    slot = get_object_or_404(ParkingLot, id=slot_id)
    vehicle = get_object_or_404(Vehicle, id=vehicle_id, user=request.user)

    already_parked = ParkingEntry.objects.filter(vehicle=vehicle).exists()

    if already_parked:
        return Response({
            "message": "Vehicle already parked in another slot"
        }, status=400)

    if ParkingEntry.objects.filter(slot=slot, exit_time__isnull=True).exists():
        return Response({"error": "Slot already occupied"}, status=400)

    ParkingEntry.objects.create(slot=slot, vehicle=vehicle)
    return Response({"msg": "Parked successfully"}, status=201)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def exit_vehicle(request, id):
    entry = get_object_or_404(ParkingEntry, id=id)

    if entry.exit_time:
        return Response({"error": "Already exited"}, status=400)

    entry.exit_time = timezone.now()
    entry.save()

    return Response({"msg": "Exited successfully"})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_slot(request):
    # Only admin/staff users can create slots
    if not request.user.is_staff:
        return Response(
            {"detail": "You do not have permission to create parking slots. Only admin users can do this."},
            status=403
        )
    
    serializer = ParkingLotSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg": "Slot created"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """Returns current user info including admin status"""
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "is_staff": request.user.is_staff,
        "is_admin": request.user.is_superuser
    })
