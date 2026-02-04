from django.shortcuts import render
from .models import ParkingLot,Vehicle,ParkingEntry,Fines
from .serializers import ParkingLotSerializer,VehicleSeriailizer,ParkingEntrySerializer,FinesSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def create_slot(request):
    serializer = ParkingLotSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg":"Created"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
@api_view(['GET'])
def available_slots(request):
    busy_slots = ParkingEntry.objects.filter(
        exit_time__isnull=True
    ).values_list('slot', flat=True)

    slots = ParkingLot.objects.exclude(id__in=busy_slots)
    serializer = ParkingLotSerializer(slots, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_vehicle(request):
    serializer = VehicleSeriailizer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({"msg": "Vehicle added"})
    return Response(serializer.errors)


@api_view(['GET'])
def fines(request):
    data = Fines.objects.all()
    return Response(FinesSerializer(data, many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def park(request):
    slot_id = request.data.get('slot')
    vehicle_id = request.data.get('vehicle')

    if not slot_id or not vehicle_id:
        return Response(
            {"error": "slot and vehicle are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # slot must exist
    slot = get_object_or_404(ParkingLot, id=slot_id)

    # vehicle must belong to logged-in user
    vehicle = get_object_or_404(Vehicle, id=vehicle_id, user=request.user)

    # check if slot already busy
    if ParkingEntry.objects.filter(slot=slot, exit_time__isnull=True).exists():
        return Response({"error": "Slot is already occupied"}, status=400)

    ParkingEntry.objects.create(
        slot=slot,
        vehicle=vehicle,
        entry_time=timezone.now()
    )

    return Response({"msg": "Parked successfully"}, status=201)
def exit(request, id):
    entry = get_object_or_404(ParkingEntry, id=id)

    if entry.exit_time:
        return Response({"error": "Already exited"})

    entry.exit_time = timezone.now()
    entry.save()

    time_spent = timezone.now() - entry.entry_time

    if time_spent.total_seconds() > 3600:
        Fines.objects.create(parking=entry, amount=200)

    return Response({"msg": "Exited"})

def create_slot(request):
    serializer = ParkingLotSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg":"Created"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 