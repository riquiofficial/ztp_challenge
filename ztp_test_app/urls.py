from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('getdata', views.send_json_data, name="json_data")
]
