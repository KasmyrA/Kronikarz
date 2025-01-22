from django.db import models
from django.contrib.auth.models import User
from Tree.models import Tree

class Relationship(models.Model):
    RELATIONSHIP_KIND_CHOICES = [
        ("unformal", "Unformal"),
        ("engagement", "Engagement"),
        ("marriage", "Marriage"),
        ("separation", "Separation"),
        ("divorce", "Divorce"),
    ]

    tree = models.ForeignKey(Tree, on_delete=models.CASCADE, related_name='relationships')
    partner1 = models.ForeignKey(
        'Person.Person', 
        on_delete=models.CASCADE, 
        related_name='partner1_relationships'
    )
    partner2 = models.ForeignKey(
        'Person.Person', 
        on_delete=models.CASCADE, 
        related_name='partner2_relationships'
    )
    kind = models.CharField(
        max_length=20,
        choices=RELATIONSHIP_KIND_CHOICES
    )
    from_date = models.CharField(max_length=255, null=True, blank=True)
    untill_date = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.get_kind_display()} between {self.partner1} and {self.partner2}"
