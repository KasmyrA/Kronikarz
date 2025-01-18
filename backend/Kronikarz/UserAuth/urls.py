from UserAuth import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LogoutView
urlpatterns = [
    # UserAuth
    path('', views.UserViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(),name='logout' ),
]


urlpatterns = format_suffix_patterns(urlpatterns)