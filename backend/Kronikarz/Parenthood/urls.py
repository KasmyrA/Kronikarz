from Parenthood import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Parenthood
    path('', views.parenthoods_list),
    path('<int:id>/', views.parenthood_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
