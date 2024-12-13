from django.db import models
from db_connection import db

# Create your models here.

relationship_collection = db['relationships']
tree_collection  = db['trees']

class RelationshipConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = relationship'


class TreeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'parenthood'