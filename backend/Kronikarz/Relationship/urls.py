from Relationship import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Relationship
    path('', views.relationships_list),
    path('<int:id>/', views.relationship_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
