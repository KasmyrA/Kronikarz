"""
URL configuration for BackendSerwer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core import views

# Create the router and register the viewset
router = routers.DefaultRouter()
router.register(r'register', views.UserRegistrationView,basename='register')

# Extend urlpatterns to include the router and other paths
urlpatterns = [
    path('admin/', admin.site.urls),  
    path('api/', include(router.urls)),
    # Persons  
    path('persons/', views.get_all_persons),  
    path('persons/<str:uid>/<int:id>/', views.get_one_person),  
    path('persons/create/<str:uid>/', views.create_person),  
    path('persons/delete/<str:uid>/<int:id>/', views.delete_one_person),  
    path('persons/update/<str:uid>/<int:id>/', views.update_one_person),
    # Parenthoods  
    path('parenthoods/', include('parenthood.urls')),
    # Relationships  
    path('relationships/', views.get_all_relationships),
    path('relationships/<str:uid>/<int:id>/', views.get_one_relationship),
    path('relationships/create/<str:uid>/',views.create_relationship),
    path('relationships/delete/<str:uid>/<int:id>/',views.delete_one_relationship),
    path('relationships/update/<str:uid>/<int:id>/',views.update_one_relationship),
    # Trees
    path('trees/', views.get_all_trees),
    path('trees/<str:uid>/<int:id>/', views.get_one_tree),
    path('trees/delete/<str:uid>/<int:id>/',views.delete_one_tree),
    path('trees/update/<str:uid>/<int:id>/', views.update_one_tree),
    path('trees/create/<str:uid>/',views.create_tree),

]



'''
urlpatterns = [
    path('', views.get_all),
    path('by-child/<int:record_child>/', views.get_one_by_child),
]

'''

'''
urlpatterns = [path]
urlpatterns = [
    path('admin/', admin.site.urls),
]
[path('admin/',admin.site.urls),path('api/',include(router.urls)),]

'''
