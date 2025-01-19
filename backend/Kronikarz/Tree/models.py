from django.db import models
from django.contrib.auth.models import User

class Tree(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    people = models.ManyToManyField('Person.Person', related_name='trees', blank=True)
    relationships = models.ManyToManyField('Relationship.Relationship', related_name='trees', blank=True)
    parenthoods = models.ManyToManyField('Parenthood.Parenthood', related_name='trees', blank=True)

    def __str__(self):
        return self.name


class Position(models.Model):
    person = models.OneToOneField('Person.Person', on_delete=models.CASCADE)
    tree = models.ForeignKey(Tree, on_delete=models.CASCADE, related_name='positions')
    x = models.FloatField()
    y = models.FloatField()

    def __str__(self):
        return f"Position for {self.person} in tree {self.tree.name}"
