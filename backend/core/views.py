from django.shortcuts import render
from rest_framework import status,viewsets
from django.http import JsonResponse
#from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


from rest_framework import permissions
from rest_framework import renderers
from rest_framework.decorators import action
from django.shortcuts import render
from .models import relationships_collection
from .models import trees_collection
from django.http import HttpResponse, JsonResponse




def get_all_relationships(request):
    relationships = list(relationships_collection.find())
    for relationship in relationships:
        relationship['_id'] = str(relationship['_id'])
    return JsonResponse(relationships, safe=False)

def get_one_relationship(request, record_relation):
    try:
        record_relation = int(record_relation)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)
    
    record = relationships_collection.find_one({"relationship": record_relation})
    if record:
        record['_id'] = str(record['_id'])
        return JsonResponse(record)
    else:
        return JsonResponse({"error": "Record not found"}, status=404)

def delete_one_relationship(request, record_relation):
    if request.method == "DELETE":
        try:
            record_relation = int(record_relation)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)
        
        
        result = relationships_collection.delete_one({"relationship": record_relation})
        
        if result.deleted_count > 0:
            return JsonResponse({"message": f"Record with relationship {record_relation} successfully deleted."}, status=200)
        else:
            return JsonResponse({"error": "Record not found or already deleted."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)

def update_one_relationship(request, record_relation):
    if request.method == "PUT":
        try:
            
            record_relation = int(record_relation)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)

        
        try:
            data = json.loads(request.body)  
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        
        record = relationships_collection.find_one({"relationship": record_relation})
        if not record:
            return JsonResponse({"error": "Record not found."}, status=404)

        
        update_result = relationships_collection.update_one(
            {"relationship": record_relation},  
            {"$set": data}                      
        )
        if update_result.modified_count > 0:
            return JsonResponse({"message": "Record successfully updated."}, status=200)
        else:
            return JsonResponse({"message": "No changes made to the record."}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)
        



def get_all_trees(request):
    trees = list(trees_collection.find())
    for tree in trees:
        tree['_id'] = str(tree['_id'])
    return JsonResponse(trees, safe=False)

def get_one_tree(request, record_tree):
    try:
        record_tree = int(record_tree)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)
    
    record = trees_collection.find_one({"tree": record_tree})
    if record:
        record['_id'] = str(record['_id'])
        return JsonResponse(record)
    else:
        return JsonResponse({"error": "Record not found"}, status=404)



class UserRegistrationView(viewsets.ViewSet):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
              "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
'''
from rest_framework.views import APIView
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
              "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
