from django.db import models
from django.contrib.auth.models import User

class Tree(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

    def delete_related_people(self):
        for person in self.people.all():
            person.delete_related_objects()

    def delete(self, *args, **kwargs):
        self.delete_related_people()
        super().delete(*args, **kwargs)