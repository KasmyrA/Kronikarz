from django.shortcuts import render
from .models import parenthoods_collection
from django.http import HttpResponse, JsonResponse

# Create your views here.

def get_all(request):
    parenthoods = list(parenthoods_collection.find())
    for parenthood in parenthoods:
        parenthood['_id'] = str(parenthood['_id'])
    return JsonResponse(parenthoods, safe=False)

def get_one_by_child(request, record_child):
    try:
        record_child = int(record_child)
    except ValueError:
        return JsonResponse({"error": "Invalid ID format. Must be an integer."}, status=400)
    
    record = parenthoods_collection.find_one({"child": record_child})
    if record:
        record['_id'] = str(record['_id'])
        return JsonResponse(record)
    else:
        return JsonResponse({"error": "Record not found"}, status=404)
