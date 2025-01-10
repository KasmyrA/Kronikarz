from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Relationship
from .serializers import RelationshipSerializer


# Relationship

@api_view(['GET', 'POST'])
def relationships_list(request, format=None):

    if request.method == 'GET':
        relationships = Relationship.objects.all()
        serializer = RelationshipSerializer(relationships, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = RelationshipSerializer(deta=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])   
def relationship_detail(request, id, format=None):
    try:
        relationship = Relationship.objects.get(pk=id)
    except Relationship.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RelationshipSerializer(relationship)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = RelationshipSerializer(relationship, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        relationship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
