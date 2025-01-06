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
from .models import persons_collection
from .models import parenthoods_collection
from .models import users_collection
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
    if request.method in ['POST', 'PUT']:
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

        
        doc = trees_collection.find_one({"_id": uid})

        if not doc:
           
            new_tree = {
                "id": 1,  
                "name": data.get('name', ''),
                "people": data.get('people', []),
                "relationships": data.get('relationships', []),
                "parenthoods": data.get('parenthoods', [])
            }
            new_document = {
                "_id": uid,
                "trees": [new_tree]
            }
            result = trees_collection.insert_one(new_document)
            if result.inserted_id:
                return JsonResponse(new_tree, status=201)
            else:
                return JsonResponse({"error": "Failed to add new tree."}, status=500)
        else:

            trees = doc.get("trees", [])
            tree_exists = next((tree for tree in trees if tree.get("id") == data.get("id")), None)

            if tree_exists:

                tree_exists.update({
                    "name": data.get('name', tree_exists.get('name', '')),
                    "people": data.get('people', tree_exists.get('people', [])),
                    "relationships": data.get('relationships', tree_exists.get('relationships', [])),
                    "parenthoods": data.get('parenthoods', tree_exists.get('parenthoods', []))
                })
            else:

                new_tree = {
                    "id": len(trees) + 1,
                    "name": data.get('name', ''),
                    "people": data.get('people', []),
                    "relationships": data.get('relationships', []),
                    "parenthoods": data.get('parenthoods', [])
                }
                trees.append(new_tree)

            result = trees_collection.update_one(
                {"_id": uid},
                {"$set": {"trees": trees}}
            )

            if result.modified_count > 0:
                return JsonResponse(new_tree if tree_exists else trees[-1], status=201)
            else:
                return JsonResponse({"error": "Failed to update tree."}, status=500)

    else:
        return JsonResponse({"error": "Only POST and PUT requests are allowed."}, status=405)

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

# Persons

def get_all_persons(request):
    persons = list(persons_collection.find())
    for person in persons:
        person['_id'] = str(person['_id'])
    return JsonResponse(persons, safe=False)
    
def get_one_person(request, uid, id):
    try:
        uid = ObjectId(uid)
        id = int(id)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format."}, status=400)

    record = persons_collection.find_one({"_id": uid})
    print(record)
    if record and "persons" in record:
        for person in record["persons"]:
            if person["id"] == id:
                return JsonResponse(person, safe=False)
    
    return JsonResponse("Not Found",safe=False)

def delete_one_person(request, uid, id):
    if request.method == "DELETE":
        try:
            uid = ObjectId(uid)
            id = int(id)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)

        record = persons_collection.find_one({"_id": uid})
        if record and "persons" in record:

            updated_persons = [
                person for person in record["persons"] if person["id"] != id
            ]
            

            if len(updated_persons) < len(record["persons"]):
                result = persons_collection.update_one(
                    {"_id": uid},
                    {"$set": {"persons": updated_persons}}
                )
                if result.modified_count > 0:
                    return JsonResponse({"message": f"Person with id {id} successfully deleted."}, status=200)
                else:
                    return JsonResponse({"error": "Failed to delete person."}, status=500)
            else:
                return JsonResponse({"error": "Person not found."}, status=404)
        else:
            return JsonResponse({"error": "Document not found."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)
    

def update_one_person(request, uid, id):
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

        record = persons_collection.find_one({"_id": uid})
        if not record:
            return JsonResponse({"error": "Document not found."}, status=404)

        updated = False
        for person in record.get("persons", []):
            if person["id"] == id:
                person.update(data)
                updated = True
                break

        if not updated:
            return JsonResponse({"error": "Person not found."}, status=404)

        result = persons_collection.update_one(
            {"_id": uid},
            {"$set": {"persons": record["persons"]}}
        )

        if result.modified_count > 0:
            return JsonResponse({"message": f"Person with id {id} successfully updated."}, status=200)
        else:
            return JsonResponse({"message": "No changes made to the person."}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)
    


@csrf_exempt
def create_person(request, uid):
    if request.method == 'POST':
        try:
            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        required_fields = ['id', 'names', 'description', 'sex', 'birth', 'death', 'surnames', 'jobs', 'files']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

        event_fields = ['date', 'place']
        for event in ['birth', 'death']:
            for field in event_fields:
                if field not in data[event]:
                    return JsonResponse({"error": f"Missing field '{field}' in {event}."}, status=400)

        if not isinstance(data['surnames'], list) or not isinstance(data['jobs'], list) or not isinstance(data['files'], list):
            return JsonResponse({"error": "Fields 'surnames', 'jobs', and 'files' must be arrays."}, status=400)

        record = persons_collection.find_one({"_id": uid})

        if not record:
            new_person = {
                "id": data['id'],
                "names": data['names'],
                "image": data.get('image', None),
                "description": data['description'],
                "sex": data['sex'],
                "birth": data['birth'],
                "death": data['death'],
                "surnames": data['surnames'],
                "jobs": data['jobs'],
                "files": data['files'],
            }
            new_record = {
                "_id": uid,
                "people": [new_person]
            }
            persons_collection.insert_one(new_record)
            return JsonResponse(new_person, status=201)

        people = record.get("people", [])
        max_id = max((person["id"] for person in people), default=0)
        new_person_id = max_id + 1

        new_person = {
            "id": new_person_id,
            "names": data['names'],
            "image": data.get('image', None),
            "description": data['description'],
            "sex": data['sex'],
            "birth": data['birth'],
            "death": data['death'],
            "surnames": data['surnames'],
            "jobs": data['jobs'],
            "files": data['files'],
        }

        people.append(new_person)
        result = persons_collection.update_one(
            {"_id": uid},
            {"$set": {"people": people}}
        )

        if result.modified_count > 0:
            return JsonResponse(new_person, status=201)
        else:
            return JsonResponse({"error": "Failed to add new person."}, status=500)

    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)



# Parenthoods

def get_all_parenthoods(request):
    parenthoods = list(parenthoods_collection.find())
    for parenthood in parenthoods:
        parenthood['_id'] = str(parenthood['_id'])
    return JsonResponse(parenthoods, safe=False) 

def get_one_parenthood(request, uid, id):
    try:
        uid = ObjectId(uid)
        id = int(id)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format."}, status=400)

    record = parenthoods_collection.find_one({"_id": uid})
    print(record)
    if record and "parenthoods" in record:
        for parenthood in record["parenthoods"]:
            if parenthood["id"] == id:
                return JsonResponse(parenthood,safe=False)
    
    return JsonResponse("Not Found",safe=False)


def delete_one_parenthood(request, uid, id):
    if request.method == "DELETE":
        try:
            uid = ObjectId(uid)
            id = int(id)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)

        record = parenthoods_collection.find_one({"_id": uid})
        if record and "parenthoods" in record:
            updated_parenthoods = [
                parenthood for parenthood in record["parenthoods"] if parenthood["id"] != id
            ]

            if len(updated_parenthoods) < len(record["parenthoods"]):
                result = parenthoods_collection.update_one(
                    {"_id": uid},
                    {"$set": {"parenthoods": updated_parenthoods}}
                )
                if result.modified_count > 0:
                    return JsonResponse({"message": f"Parenthood with id {id} successfully deleted."}, status=200)
                else:
                    return JsonResponse({"error": "Failed to delete parenthood."}, status=500)
            else:
                return JsonResponse({"error": "Parenthood not found."}, status=404)
        else:
            return JsonResponse({"error": "Document not found."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)
    

def update_one_parenthood(request, uid, id):
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

        record = parenthoods_collection.find_one({"_id": uid})
        if not record:
            return JsonResponse({"error": "Document not found."}, status=404)

        updated = False
        for parenthood in record.get("parenthoods", []):
            if parenthood["id"] == id:
                parenthood.update(data)
                updated = True
                break

        if not updated:
            return JsonResponse({"error": "Parenthood not found."}, status=404)

        result = parenthoods_collection.update_one(
            {"_id": uid},
            {"$set": {"parenthoods": record["parenthoods"]}}
        )

        if result.modified_count > 0:
            return JsonResponse({"message": f"Parenthood with id {id} successfully updated."}, status=200)
        else:
            return JsonResponse({"message": "No changes made to the parenthood."}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)
    

@csrf_exempt
def create_parenthood(request, uid):
    if request.method == 'POST':
        try:
            uid = ObjectId(uid)
        except ValueError:
            return JsonResponse({"error": "Invalid document ID format."}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        required_fields = ['id', 'mother', 'father', 'child', 'adoption']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

        adoption_fields = ['mother', 'father', 'date']
        if data['adoption'] is not None:
            for field in adoption_fields:
                if field not in data['adoption']:
                    return JsonResponse({"error": f"Missing field '{field}' in adoption."}, status=400)

        record = parenthoods_collection.find_one({"_id": uid})

        if not record:
            new_parenthood = {
                "id": data['id'],
                "mother": data['mother'],
                "father": data['father'],
                "child": data['child'],
                "adoption": data['adoption'],
            }
            new_record = {
                "_id": uid,
                "parenthoods": [new_parenthood]
            }
            parenthoods_collection.insert_one(new_record)
            return JsonResponse(new_parenthood, status=201)

        parenthoods = record.get("parenthoods", [])
        max_id = max((parenthood["id"] for parenthood in parenthoods), default=0)
        new_parenthood_id = max_id + 1

        new_parenthood = {
            "id": new_parenthood_id,
            "mother": data['mother'],
            "father": data['father'],
            "child": data['child'],
            "adoption": data['adoption'],
        }

        parenthoods.append(new_parenthood)

        result = parenthoods_collection.update_one(
            {"_id": uid},
            {"$set": {"parenthoods": parenthoods}}
        )

        if result.modified_count > 0:
            return JsonResponse(new_parenthood, status=201)
        else:
            return JsonResponse({"error": "Failed to add new parenthood."}, status=500)

    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


    # views for users
    '''path('users/', views.get_users),
    path('users/<str:uid>/<str:UserUid>/', views.get_one_user),
    path('users/delete/<str:uid>/<str:UserUid>/', views.delete_user),
    path('users/update/<str:uid>/<str:UserUid>/', views.update_user),
    path('users/create/<str:uid>/',views.create_user),
]'''



def get_users(request):
    document = users_collection.find_one({}, {"_id": 0, "users": 1})
    
    if not document or "users" not in document:
        return JsonResponse([], safe=False)  

    users = document["users"]

    for user in users:
        user['_id'] = str(user['_id'])
        user['parenthoods'] = [str(oid) for oid in user.get('parenthoods', [])]
        user['persons'] = [str(oid) for oid in user.get('persons', [])]
        user['relationships'] = [str(oid) for oid in user.get('relationships', [])]
        user['trees'] = [str(oid) for oid in user.get('trees', [])]

    return JsonResponse(users, safe=False)


    
def delete_user(request, uid, UserUid):
    
    if request.method == "DELETE":
        try:
            uid = ObjectId(uid)
            UserUid = ObjectId(UserUid)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)
        
        user_record = users_collection.find_one({"_id": uid})
        if user_record and "users" in user_record:
            
            updated_users = [
                user for user in user_record["users"] if user["_id"] != UserUid
            ]
            
            if len(updated_users) < len(user_record["users"]):
                result = users_collection.update_one(
                    {"_id": uid},
                    {"$set": {"users": updated_users}}
                )
                
                if result.modified_count > 0:
                    return JsonResponse({"message": f"User with id {UserUid} successfully deleted."}, status=200)
                else:
                    return JsonResponse({"error": "Failed to delete user."}, status=500)
            else:
                return JsonResponse({"error": "User not found."}, status=404)
        else:
            return JsonResponse({"error": "Document not found."}, status=404)
    
    else:
        return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)
    
def update_user(request, uid, UserUid):
    if request.method == "PATCH":  
        try:
            uid = ObjectId(uid)  
            UserUid = ObjectId(UserUid)  
        except ValueError:
            return JsonResponse({"error": "Invalid ID format."}, status=400)

        try:
            data = json.loads(request.body)  
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

        if not data:
            return JsonResponse({"error": "No data provided to update."}, status=400)

        user_record = users_collection.find_one({"_id": uid})
        
        if user_record and "users" in user_record:
            user_to_update = None
            for user in user_record["users"]:
                if user["_id"] == UserUid:
                    user_to_update = user
                    break
            
            if user_to_update:
                for key, value in data.items():
                    if key in user_to_update:  
                        user_to_update[key] = value

                result = users_collection.update_one(
                    {"_id": uid, "users._id": UserUid},
                    {"$set": {"users.$": user_to_update}}  
                )

                if result.modified_count > 0:
                    return JsonResponse({"message": f"User with id {UserUid} successfully updated."}, status=200)
                else:
                    return JsonResponse({"error": "Failed to update user."}, status=500)
            else:
                return JsonResponse({"error": "User not found in the array."}, status=404)
        else:
            return JsonResponse({"error": "Document not found."}, status=404)

    else:
        return JsonResponse({"error": "Invalid request method. Use PATCH."}, status=405)

@csrf_exempt
def create_user(request, uid):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        uid = ObjectId(uid)
    except ValueError:
        return JsonResponse({"error": "Invalid document ID format."}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if 'login' not in data or 'password' not in data:
        return JsonResponse({"error": "Missing required fields: 'login' and 'password'."}, status=400)

    login = data['login']
    password = data['password']

    record = users_collection.find_one({"_id": uid})

    if not record:
        return JsonResponse({"error": "Document not found."}, status=404)

    person = {
        "_id": ObjectId(),
        "id": 1,
        "names": ["Template", "Person"],
        "image": 0,
        "description": "Default description",
        "sex": "U",
        "birth": {"date": None, "place": None},
        "death": {"date": None, "place": None},
        "surnames": [],
        "jobs": [],
        "files": []
    }

    parenthood = {
        "_id": ObjectId(),
        "mother": None,
        "father": None,
        "child": None,
        "adoption": {"mother": None, "father": None, "date": None}
    }

    tree = {
        "_id": ObjectId(),
        "trees": [
            {
                "id": 1,
                "name": "Template Family Tree",
                "people": [],
                "relationships": [],
                "parenthoods": []
            }
        ]
    }

    relationship = {
        "_id": ObjectId(),
        "relationships": []
    }

    persons_collection.insert_one(person)
    parenthoods_collection.insert_one(parenthood)
    trees_collection.insert_one(tree)
    relationships_collection.insert_one(relationship)

    new_user = {
        "_id": ObjectId(),
        "login": login,
        "password": password,
        "parenthoods": [parenthood["_id"]],
        "persons": [person["_id"]],
        "relationships": [relationship["_id"]],
        "trees": [tree["_id"]],
    }

    result = users_collection.update_one(
        {"_id": uid},
        {"$push": {"users": new_user}}
    )

    if result.modified_count > 0:
        new_user_serializable = {
            "_id": str(new_user["_id"]),
            "login": new_user["login"],
            "password": new_user["password"],
            "parenthoods": [str(parenthood["_id"])],
            "persons": [str(person["_id"])],
            "relationships": [str(relationship["_id"])],
            "trees": [str(tree["_id"])],
        }
        return JsonResponse({"message": "User created successfully.", "user": new_user_serializable}, status=201)
    else:
        persons_collection.delete_one({"_id": person["_id"]})
        parenthoods_collection.delete_one({"_id": parenthood["_id"]})
        trees_collection.delete_one({"_id": tree["_id"]})
        relationships_collection.delete_one({"_id": relationship["_id"]})

        return JsonResponse({"error": "Failed to add new user."}, status=500)




def get_one_user(request, uid, UserUid):
    try:
        uid = ObjectId(uid)
        UserUid = ObjectId(UserUid)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format."}, status=400)

    record = users_collection.find_one({"_id": uid}, {"_id": 0, "users": 1})

    if not record or "users" not in record:
        return JsonResponse({"error": "Users not found."}, status=404)

    for user in record["users"]:
        if user["_id"] == UserUid:
            user["_id"] = str(user["_id"])
            user["parenthoods"] = [str(oid) for oid in user.get("parenthoods", [])]
            user["persons"] = [str(oid) for oid in user.get("persons", [])]
            user["relationships"] = [str(oid) for oid in user.get("relationships", [])]
            user["trees"] = [str(oid) for oid in user.get("trees", [])]
            return JsonResponse(user, safe=False)

    return JsonResponse({"error": "User not found."}, status=404)
        


        
    