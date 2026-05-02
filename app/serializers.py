from .models import ParkingLot,Vehicle,ParkingEntry
from rest_framework import serializers

class ParkingLotSerializer(serializers.ModelSerializer) :
    class Meta:
        model = ParkingLot
        fields = '__all__'
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
class ParkingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model=ParkingEntry
        fields='__all__'
