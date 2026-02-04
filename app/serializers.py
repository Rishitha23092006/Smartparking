from .models import ParkingLot,Vehicle,ParkingEntry,Fines
from rest_framework import serializers

class ParkingLotSerializer(serializers.ModelSerializer) :
    class Meta:
        model = ParkingLot
        fields = '__all__'
class VehicleSeriailizer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
class ParkingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model=ParkingEntry
        fields='__all__'
class FinesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Fines
        fields='__all__'
                        