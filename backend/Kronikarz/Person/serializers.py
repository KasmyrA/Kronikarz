from rest_framework import serializers
from django.db import transaction
from .models import Person, EventInLife, Surname, Job, File

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


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    birth = EventInLifeSerializer()
    death = EventInLifeSerializer()
    surnames = SurnameSerializer(many=True)
    jobs = JobSerializer(many=True)
    files = FileSerializer(many=True)

    class Meta:
        model = Person
        fields = '__all__'

    def create(self, validated_data):
        birth_data = validated_data.pop('birth')
        death_data = validated_data.pop('death', None)
        surnames_data = validated_data.pop('surnames', [])
        jobs_data = validated_data.pop('jobs', [])
        files_data = validated_data.pop('files', [])

        birth = EventInLife.objects.create(**birth_data)
        death = EventInLife.objects.create(**death_data) if death_data else None

        person = Person.objects.create(birth=birth, death=death, **validated_data)

        for surname_data in surnames_data:
            surname = Surname.objects.create(**surname_data)
            person.surnames.add(surname)

        for job_data in jobs_data:
            job = Job.objects.create(**job_data)
            person.jobs.add(job)

        for file_data in files_data:
            file = File.objects.create(**file_data)
            person.files.add(file)

        return person
    
    @transaction.atomic
    def update(self, instance, validated_data):
        birth_data = validated_data.pop('birth', None)
        if birth_data:
            if instance.birth:
                instance.birth.delete()
            instance.birth = EventInLife.objects.create(**birth_data)

        death_data = validated_data.pop('death', None)
        if death_data:
            if instance.death:
                instance.death.delete()
            instance.death = EventInLife.objects.create(**death_data)
        elif instance.death:
            instance.death.delete()
            instance.death = None

        surnames_data = validated_data.pop('surnames', None)
        if surnames_data is not None:
            instance.surnames.clear()
            for surname_data in surnames_data:
                surname = Surname.objects.create(**surname_data)
                instance.surnames.add(surname)

        jobs_data = validated_data.pop('jobs', None)
        if jobs_data is not None:
            instance.jobs.clear()
            for job_data in jobs_data:
                job = Job.objects.create(**job_data)
                instance.jobs.add(job)

        files_data = validated_data.pop('files', None)
        if files_data is not None:
            instance.files.clear()
            for file_data in files_data:
                file = File.objects.create(**file_data)
                instance.files.add(file)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance