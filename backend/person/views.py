from django.shortcuts import render
from .models import persons_collection
from django.http import HttpResponse, JsonResponse

# Create your views here.

def get_all(request):
    persons = list(persons_collection.find())
    for person in persons:
        person['_id'] = str(person['_id'])
    return JsonResponse(persons, safe=False)

def get_one(request, record_id):
    try:
        record_id = int(record_id)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)
    
    record = persons_collection.find_one({"id": record_id})
    if record:
        record['_id'] = str(record['_id'])
        return JsonResponse(record)
    else:
        return JsonResponse({"error": "Record not found"}, status=404)