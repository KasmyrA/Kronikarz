from rest_framework import serializers
from Person.models import Person
from .models import Position

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['x', 'y']

class TreePersonSerializer(serializers.ModelSerializer):
    position = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['id', 'name', 'surname', 'sex', 'image_url', 'birth_date', 'death_date', 'position']

    def get_position(self, obj):
        # Pobieramy pozycję przypisaną do tej osoby w kontekście drzewa
        tree = self.context.get('tree')
        try:
            position = Position.objects.get(person=obj, tree=tree)
            return PositionSerializer(position).data
        except Position.DoesNotExist:
            return None


from rest_framework import serializers
from Person.models import Person
from Relationship.models import Relationship
from Parenthood.models import Parenthood
from .models import Tree
from .serializers import TreePersonSerializer

class TreeSerializer(serializers.ModelSerializer):
    people = serializers.SerializerMethodField()
    relationships = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    parenthoods = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Tree
        fields = ['id', 'name', 'people', 'relationships', 'parenthoods']

    def get_people(self, obj):
        # Przekazujemy kontekst drzewa, aby pobrać pozycję
        people = obj.people.all()
        serializer = TreePersonSerializer(people, many=True, context={'tree': obj})
        return serializer.data
