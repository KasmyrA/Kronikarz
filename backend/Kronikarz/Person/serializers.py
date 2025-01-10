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

    def create(self, validated_data):
        birth_data = validated_data.pop('birth')
        death_data = validated_data.pop('death', None)
        surnames_data = validated_data.pop('surnames', [])
        jobs_data = validated_data.pop('jobs', [])
        files_data = validated_data.pop('files', [])

        # Tworzenie EventInLife (birth i death)
        birth = EventInLife.objects.create(**birth_data)
        death = EventInLife.objects.create(**death_data) if death_data else None

        # Tworzenie osoby
        person = Person.objects.create(birth=birth, death=death, **validated_data)

        # Tworzenie powiązanych obiektów
        for surname_data in surnames_data:
            surname = Surname.objects.create(**surname_data)
            person.surnames.add(surname)

        for job_data in jobs_data:
            job = Job.objects.create(**job_data)
            person.jobs.add(job)

        for file_data in files_data:
            file = FileInfo.objects.create(**file_data)
            person.files.add(file)

        return person

