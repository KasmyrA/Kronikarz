from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Relationship
from .serializers import RelationshipSerializer
from rest_framework.permissions import IsAuthenticated

# Relationship

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def relationships_list(request, format=None):

    if request.method == 'GET':
        relationships = Relationship.objects.all()
        serializer = RelationshipSerializer(relationships, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = RelationshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
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
    