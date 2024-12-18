from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all),
    path('by-child/<int:record_child>/', views.get_one_by_child),
]