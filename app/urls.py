from django.urls import path
from .views import (
    available_slots,
    add_vehicle,
    park,
    exit_vehicle,
    create_slot,
    user_vehicles,
    user_info
)

urlpatterns = [
    path('slots/available/', available_slots),
    path('vehicle/', add_vehicle),
    path('vehicles/', user_vehicles),
    path('park/', park),
    path('exit/<int:id>/', exit_vehicle),
    path('slot/', create_slot),
    path('user/info/', user_info)
]
