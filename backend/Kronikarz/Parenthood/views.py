from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Parenthood
from .serializers import ParenthoodSerializer


# Parenthood

@api_view(['GET', 'POST'])
def parenthoods_list(request, format=None):

    if request.method == 'GET':
        parenthoods = Parenthood.objects.all()
        serializer = ParenthoodSerializer(parenthoods, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ParenthoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])   
def parenthood_detail(request, id, format=None):
    try:
        parenthood = Parenthood.objects.get(pk=id)
    except Parenthood.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ParenthoodSerializer(parenthood)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ParenthoodSerializer(parenthood, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        parenthood.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
