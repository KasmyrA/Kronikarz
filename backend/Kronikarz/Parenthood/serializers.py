from rest_framework import serializers
from .models import Parenthood
from Tree.models import Tree

class ParenthoodSerializer(serializers.ModelSerializer):
    tree = serializers.PrimaryKeyRelatedField(queryset=Tree.objects.all())
    class Meta:
        model = Parenthood
        fields = '__all__'
