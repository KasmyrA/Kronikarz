from rest_framework import serializers
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(style ={'input_type': 'password'},write_only=True)

class Meta:
	model = User
	#idk czy mamy dawaæ email czy nie, jak tak to dodajta email w poni¿sz¹ linijkê
	fields = ['username','password','password2']
	extra_kwargs = {'password':{'write_only': True}}
	def validate(self,attrs):
		if attrs['password'] != attrs['password2']:
			raise serializers.ValidationError({"password": "Given passwords do not match"})
		return attrs
	def create(self,validated_data):
		user = User.objects.create_user(username = validated_data['username'],
		password=validated_data['password'])
		return user