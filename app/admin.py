from django.contrib import admin

from .models import Vehicle,ParkingLot,ParkingEntry,Fines
# Register your models here.
admin.site.register(Vehicle)
admin.site.register(ParkingLot)
admin.site.register(ParkingEntry)
admin.site.register(Fines)