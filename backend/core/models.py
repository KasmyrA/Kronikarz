from django.db import models
from db_connection import db

# Create your models here.

relationships_collection = db['relationships']
trees_collection  = db['trees']
'''
class RelationshipConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = relationship'


class TreeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'parenthood'
'''