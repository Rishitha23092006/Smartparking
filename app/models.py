from django.db import models
from django.contrib.auth.models import User

class ParkingLot(models.Model):
    location = models.CharField(max_length=20)
class Vehicle(models.Model):
     user = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True)
     number = models.CharField(max_length=20)
class ParkingEntry(models.Model):
    slot = models.ForeignKey(ParkingLot,on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True,blank=True)       
class Fines(models.Model):
        parking = models.ForeignKey(ParkingEntry, on_delete=models.CASCADE)
        amount = models.IntegerField()
        is_paid = models.BooleanField(default=False)