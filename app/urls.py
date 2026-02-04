from django.urls import path
from .views import park,add_vehicle


# urlpatterns=[
#     # path('slot/',create_slot),
        
#     path('park/',park),
#     # path('exit/<int:id>/',exit),
#     # path('available/',available_slots),
#     # path('fines/',fines),
# ]
urlpatterns = [
    path('park/', park),
    path('vehicle/',add_vehicle),
]