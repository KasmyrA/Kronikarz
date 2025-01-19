from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Tree
from .serializers import TreeSerializer
from rest_framework.permissions import IsAuthenticated


# Tree

@api_view(['GET', 'POST'])
#@permission_classes([IsAuthenticated])
def tree_list(request, format=None):
    if request.method == 'GET':
        trees = Tree.objects.all()
        serializer = TreeSerializer(trees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
#@permission_classes([IsAuthenticated])
def tree_detail(request, id, format=None):
    try:
        tree = Tree.objects.get(pk=id)
    except Tree.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TreeSerializer(tree)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TreeSerializer(tree, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        tree.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trees_by_uid(request, uid, format=None):
    trees = Tree.objects.filter(uid=uid)
    if not trees.exists():
        return Response({'error': 'No trees found with the provided UID'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TreeSerializer(trees, many=True)
    return Response(serializer.data)