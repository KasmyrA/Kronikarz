from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all),
    path('<int:record_id>/', views.get_one),
]