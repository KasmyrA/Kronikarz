from rest_framework import serializers
from .models import Person, EventInLife, Surname, Job, FileInfo

class EventInLifeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInLife
        fields = '__all__'


class SurnameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surname
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class FileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileInfo
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    birth = EventInLifeSerializer()
    death = EventInLifeSerializer()
    surnames = SurnameSerializer(many=True)
    jobs = JobSerializer(many=True)
    files = FileInfoSerializer(many=True)

    class Meta:
        model = Person
        fields = '__all__'
