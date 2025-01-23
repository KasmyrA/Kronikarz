from rest_framework import serializers
from .models import Relationship
from Tree.models import Tree

class RelationshipSerializer(serializers.ModelSerializer):
    tree = serializers.PrimaryKeyRelatedField(queryset=Tree.objects.all())
    class Meta:
        model = Relationship
        fields = '__all__'
