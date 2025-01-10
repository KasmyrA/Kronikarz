from rest_framework import serializers
from .models import Parenthood

class ParenthoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parenthood
        fields = '__all__'
