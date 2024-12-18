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
import uuid
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId


#views for relationships

def get_all_relationships(request):
    relationships = list(relationships_collection.find())
    for relationship in relationships:
        relationship['_id'] = str(relationship['_id'])
    return JsonResponse(relationships, safe=False)


def get_one_relationship(request, uid, id):
    try:
        uid = ObjectId(uid)
        id = int(id)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format."}, status=400)

    record = relationships_collection.find_one({"_id": uid})
    print(record)
    if record and "relationships" in record:
        for relationship in record["relationships"]:
            if relationship["id"] == id:
                return JsonResponse(relationship,safe=False)
    
    return JsonResponse("Not Found",safe=False)


def delete_one_relationship(request, uid, id):
    if request.method == "DELETE":
        try:
            uid = ObjectId(uid)
            id = int(id)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)

        record = relationships_collection.find_one({"_id": uid})
        if record and "relationships" in record:

            updated_relationships = [
                relationship for relationship in record["relationships"] if relationship["id"] != id
            ]
            

            if len(updated_relationships) < len(record["relationships"]):
                result = relationships_collection.update_one(
                    {"_id": uid},
                    {"$set": {"relationships": updated_relationships}}
                )
                if result.modified_count > 0:
                    return JsonResponse({"message": f"Relationship with id {id} successfully deleted."}, status=200)
                else:
                    return JsonResponse({"error": "Failed to delete relationship."}, status=500)
            else:
                return JsonResponse({"error": "Relationship not found."}, status=404)
        else:
            return JsonResponse({"error": "Document not found."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)



from bson import ObjectId
from django.http import JsonResponse
import json

def update_one_relationship(request, uid, id):
    if request.method == "PUT":
        try:
            uid = ObjectId(uid)  
            id = int(id)  
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        record = relationships_collection.find_one({"_id": uid})
        if not record:
            return JsonResponse({"error": "Document not found."}, status=404)

        updated = False
        for relationship in record.get("relationships", []):
            if relationship["id"] == id:
                relationship.update(data)
                updated = True
                break

        if not updated:
            return JsonResponse({"error": "Relationship not found."}, status=404)

        result = relationships_collection.update_one(
            {"_id": uid},
            {"$set": {"relationships": record["relationships"]}}
        )

        if result.modified_count > 0:
            return JsonResponse({"message": f"Relationship with id {id} successfully updated."}, status=200)
        else:
            return JsonResponse({"message": "No changes made to the relationship."}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)

        





@csrf_exempt
def create_relationship(request, uid):
    if request.method == 'POST':
        try:
           
            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)

        try:

            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)


        required_fields = ['partner1', 'partner2', 'kind']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

        record = relationships_collection.find_one({"_id": uid})
        if not record:

            new_relationship = {
                "id": 1, 
                "partner1": data['partner1'],
                "partner2": data['partner2'],
                "kind": data['kind'],
                "date": data.get('date', None),
            }
            new_record = {
                "_id": uid,
                "relationships": [new_relationship]
            }
            relationships_collection.insert_one(new_record)
            return JsonResponse(new_relationship, status=201)


        relationships = record.get("relationships", [])
        max_id = max((relationship["id"] for relationship in relationships), default=0)
        new_relationship_id = max_id + 1


        new_relationship = {
            "id": new_relationship_id,
            "partner1": data['partner1'],
            "partner2": data['partner2'],
            "kind": data['kind'],
            "date": data.get('date', None),
        }

        relationships.append(new_relationship)
        result = relationships_collection.update_one(
            {"_id": uid},
            {"$set": {"relationships": relationships}}
        )

        if result.modified_count > 0:
            return JsonResponse(new_relationship, status=201)
        else:
            return JsonResponse({"error": "Failed to add new relationship."}, status=500)

    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


        



#views for trees


def get_all_trees(request):
    trees = list(trees_collection.find())
    for tree in trees:
        tree['_id'] = str(tree['_id'])
    return JsonResponse(trees, safe=False)

def get_one_tree(request, uid, id):
    try:
        uid = ObjectId(uid)
    except ValueError:
        return JsonResponse({"error": "Invalid document ID format."}, status=400)
    
    record = trees_collection.find_one({"_id": uid})
    print("tutaj jest record -- ",record)
    if not record:
        return JsonResponse({"error": "Parent document not found."}, status=404)
    tree = next((tree for tree in record.get("trees", []) if tree["id"] == id), None)
    if tree:
        return JsonResponse(tree, safe=False)
    else:
        return JsonResponse({"error": "Tree not found."}, status=404)

def delete_one_tree(request, uid, id):
    if request.method == "DELETE":
        try:
            
            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)
        record = trees_collection.find_one({"_id": uid})
        if not record:
            return JsonResponse({"error": "Parent document not found."}, status=404)

        tree_index = next((index for index, tree in enumerate(record.get("trees", [])) if tree["id"] == id), None)
        if tree_index is not None:
            record["trees"].pop(tree_index)
            result = trees_collection.update_one({"_id": uid}, {"$set": {"trees": record["trees"]}})
            if result.modified_count > 0:
                return JsonResponse({"message": f"Tree with ID {id} successfully deleted."}, status=200)
            else:
                return JsonResponse({"error": "Failed to delete the tree."}, status=500)
        else:
            return JsonResponse({"error": "Tree not found."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)


@csrf_exempt
def create_tree(request, uid):
    if request.method == 'POST':
        try:
            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        required_fields = ['name', 'people', 'relationships', 'parenthoods']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

        # Retrieve the parent tree by UID
        parent_tree = trees_collection.find_one({"_id": uid})
        if not parent_tree:
            return JsonResponse({"error": "Parent tree not found."}, status=404)

        # Prepare the new tree data
        new_tree = {
            "name": data.get('name', ''),
            "people": data.get('people', []),
            "relationships": data.get('relationships', []),
            "parenthoods": data.get('parenthoods', [])
        }

        # Insert the new tree into the MongoDB collection
        result = trees_collection.insert_one(new_tree)
        if result.inserted_id:
            return JsonResponse({'status': 'success', 'tree_id': result.inserted_id}, status=201)
        else:
            return JsonResponse({"error": "Failed to add new tree."}, status=500)

    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

def update_one_tree(request, uid, id):
    if request.method == "PUT":
        try:

            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)

        try:

            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        required_fields = ["name", "people", "relationships", "parenthoods"]
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

        record = trees_collection.find_one({"_id": uid})
        if not record:
            return JsonResponse({"error": "Parent document not found."}, status=404)

        tree_index = next((i for i, tree in enumerate(record["trees"]) if tree["id"] == id), None)
        if tree_index is None:
            return JsonResponse({"error": "Tree not found."}, status=404)


        record["trees"][tree_index].update(data)

        update_result = trees_collection.replace_one({"_id": uid}, record)

        if update_result.modified_count > 0:
            return JsonResponse({"message": "Tree successfully updated."}, status=200)
        else:
            return JsonResponse({"message": "No changes made to the tree."}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)

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
