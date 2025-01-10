from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Person, EventInLife, Surname, Job, FileInfo
from .serializers import PersonSerializer, EventInLifeSerializer, SurnameSerializer, JobSerializer, FileInfoSerializer


# Person

@api_view(['GET', 'POST'])
def persons_list(request, format=None):

    if request.method == 'GET':
        persons = Person.objects.all()
        serializer = PersonSerializer(persons, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])   
def person_detail(request, id, format=None):
    try:
        person = Person.objects.get(pk=id)
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonSerializer(person)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonSerializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# Surname

@api_view(['GET', 'POST'])
def surnames_list(request, format=None):

    if request.method == 'GET':
        surnames = Surname.objects.all()
        serializer = SurnameSerializer(surnames, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SurnameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])   
def surname_detail(request, id, format=None):
    try:
        surname = Surname.objects.get(pk=id)
    except Surname.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = SurnameSerializer(surname)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SurnameSerializer(surname, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        surname.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# Job

@api_view(['GET', 'POST'])
def jobs_list(request, format=None):

    if request.method == 'GET':
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])   
def job_detail(request, id, format=None):
    try:
        job = Job.objects.get(pk=id)
    except Job.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# EventInLife

@api_view(['GET', 'POST'])
def events_list(request, format=None):

    if request.method == 'GET':
        events = EventInLife.objects.all()
        serializer = EventInLifeSerializer(events, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EventInLifeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])   
def event_detail(request, id, format=None):
    try:
        event = EventInLife.objects.get(pk=id)
    except EventInLife.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EventInLifeSerializer(event)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EventInLifeSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# FileInfo

@api_view(['GET', 'POST'])
def files_list(request, format=None):

    if request.method == 'GET':
        files = FileInfo.objects.all()
        serializer = FileInfoSerializer(files, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = FileInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])   
def file_detail(request, id, format=None):
    try:
        file = FileInfo.objects.get(pk=id)
    except FileInfo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = FileInfoSerializer(file)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = FileInfoSerializer(file, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)