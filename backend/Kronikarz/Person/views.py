from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Person, EventInLife, Surname, Job, File, Image
from .serializers import PersonSerializer, EventInLifeSerializer, SurnameSerializer, JobSerializer, FileSerializer, ImageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

# Person

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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

class FileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, id=None):
        if id:
            try:
                file = File.objects.get(pk=id)
                serializer = self.serializer_class(file)
                return Response(serializer.data)
            except File.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            files = File.objects.all()
            serializer = self.serializer_class(files, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        try:
            file_instance = File.objects.get(pk=id)
        except File.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(file_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        try:
            file_instance = File.objects.get(pk=id)
            file_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except File.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)    


# Image

class ImageView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, id=None):
        if id:
            try:
                image = Image.objects.get(pk=id)
                serializer = self.serializer_class(image)
                return Response(serializer.data)
            except Image.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            images = Image.objects.all()
            serializer = self.serializer_class(images, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        try:
            image_instance = Image.objects.get(pk=id)
        except Image.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(image_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        try:
            image_instance = Image.objects.get(pk=id)
            image_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
