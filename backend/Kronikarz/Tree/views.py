from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from .models import Tree
from .serializers import TreeSerializer, SaveTreeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser
from django.shortcuts import get_object_or_404


# Tree

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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


# json export/ import 

class ExportDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id, *args, **kwargs):
        instance = get_object_or_404(Tree, pk=id)
        serializer = SaveTreeSerializer(instance)
        json_data = JSONRenderer().render(serializer.data)
        
        response = HttpResponse(json_data, content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="data.json"'
        return response

   
class ImportDataView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']
        try:
            data = JSONParser().parse(file)
        except Exception as e:
            return Response({"error": f"Invalid JSON file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(data, dict):
            return Response(
                {"error": "Expected a single JSON object, but received a different structure."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SaveTreeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "Data imported successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)