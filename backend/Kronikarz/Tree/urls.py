from Tree import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Tree
    path('', views.tree_list),
    path('<int:id>/', views.tree_detail),
    path('user/<int:uid>/', views.trees_by_uid),

    # json export/import
    path('export/<int:id>/', views.ExportDataView.as_view()),
    path('import/', views.ImportDataView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
