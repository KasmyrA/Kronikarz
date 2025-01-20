from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Person, EventInLife, Surname, Job, File
from .serializers import PersonSerializer, EventInLifeSerializer, SurnameSerializer, JobSerializer, FileSerializer
from rest_framework.permissions import IsAuthenticated

# Person

@api_view(['GET', 'POST'])
#@permission_classes([IsAuthenticated])
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
#@permission_classes([IsAuthenticated])
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def persons_by_uid(request, uid, format=None):
    persons = Person.objects.filter(uid=uid)
    if not persons.exists():
        return Response({'error': 'No persons found with the provided UID'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PersonSerializer(persons, many=True)
    return Response(serializer.data)    

# Surname

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
    

# File

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def files_list(request, format=None):

    if request.method == 'GET':
        files = File.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def file_detail(request, id, format=None):
    try:
        file = File.objects.get(pk=id)
    except File.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = FileSerializer(file)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = FileSerializer(file, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)