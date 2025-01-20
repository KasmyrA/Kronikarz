from Tree import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Tree
    path('', views.tree_list),
    path('<int:id>/', views.tree_detail),
    path('user/<int:uid>/', views.trees_by_uid),
    # Position
    path('', views.positions_list),
    path('<int:id>/', views.position_detail),
    path('user/<int:uid>/', views.positions_by_uid),
]

urlpatterns = format_suffix_patterns(urlpatterns)
