from django.db import models
from django.contrib.auth.models import User

class Parenthood(models.Model):
    PARENTHOOD_TYPE_CHOICES = [
        ("biological", "Biological"),
        ("adoptive", "Adoptive"),
    ]

    uid = models.ForeignKey(User, on_delete=models.CASCADE)
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
