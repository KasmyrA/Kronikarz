from django.db import models
from django.contrib.auth.models import User
from Tree.models import Tree

class Parenthood(models.Model):
    PARENTHOOD_TYPE_CHOICES = [
        ("biological", "Biological"),
        ("adoptive", "Adoptive"),
    ]

    tree = models.ForeignKey(Tree, on_delete=models.CASCADE, related_name='parenthoods')
    mother = models.ForeignKey(
        'Person.Person', 
        on_delete=models.SET_NULL, 
        related_name='mother_parenthoods',
        null=True, 
        blank=True
    )
    father = models.ForeignKey(
        'Person.Person', 
        on_delete=models.SET_NULL, 
        related_name='father_parenthoods',
        null=True, 
        blank=True
    )
    child = models.ForeignKey(
        'Person.Person', 
        on_delete=models.CASCADE, 
        related_name='child_parenthoods'
    )
    type = models.CharField(
        max_length=10,
        choices=PARENTHOOD_TYPE_CHOICES
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    adoption_mother = models.ForeignKey(
        'Person.Person', 
        on_delete=models.SET_NULL, 
        related_name='adoption_mother_parenthoods',
        null=True, 
        blank=True
    )
    adoption_father = models.ForeignKey(
        'Person.Person', 
        on_delete=models.SET_NULL, 
        related_name='adoption_father_parenthoods',
        null=True, 
        blank=True
    )
    adoption_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Parenthood for child {self.child} ({self.type})"
