from django.contrib import admin
from .models import (
    
    ParkingLot,
    Vehicle,
    ParkingEntry
)


admin.site.register(ParkingLot)
admin.site.register(Vehicle)
admin.site.register(ParkingEntry)

