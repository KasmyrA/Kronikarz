from UserAuth import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # UserAuth
    path('', views.UserViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('/<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-detail'),
]


urlpatterns = format_suffix_patterns(urlpatterns)