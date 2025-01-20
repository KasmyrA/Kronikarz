from rest_framework import serializers
from Person.models import Person
from Relationship.models import Relationship
from Parenthood.models import Parenthood
from .models import Position, Tree
from Parenthood.serializers import ParenthoodSerializer
from Relationship.serializers import RelationshipSerializer
from Person.serializers import PersonSerializer, ImageSerializer

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['x', 'y']

class TreePersonSerializer(serializers.ModelSerializer):
    position = serializers.SerializerMethodField()
    birthDate = serializers.CharField(source='birth.date')
    deathDate = serializers.CharField(source='death.date', allow_null=True)
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()
    image = ImageSerializer(required=False, allow_null=True)

    class Meta:
        model = Person
        fields = ['id', 'name', 'surname', 'sex', 'image', 'birthDate', 'deathDate', 'position']

    def get_position(self, obj):
        tree = self.context.get('tree')
        if not tree:
            return None
        
        try:
            position = Position.objects.get(person=obj, tree=tree)
            return PositionSerializer(position).data
        except Position.DoesNotExist:
            return None

    def get_name(self, obj):
        return obj.names[0] if obj.names else None

    def get_surname(self, obj):
        surnames = obj.surnames.all()
        return surnames[0].surname if surnames.exists() else None


class TreeSerializer(serializers.ModelSerializer):
    people = serializers.SerializerMethodField()
    relationships = serializers.SerializerMethodField()
    parenthoods = serializers.SerializerMethodField()

    class Meta:
        model = Tree
        fields = [
            'uid', 'id', 'name', 'people', 'relationships', 'parenthoods'
        ]

    def get_people(self, obj):
        people = obj.people.all()
        serializer = TreePersonSerializer(
            people, many=True, context={'tree': obj}
        )
        return serializer.data

    def get_relationships(self, obj):
        relationships = obj.relationships.all()
        return RelationshipSerializer(relationships, many=True).data

    def get_parenthoods(self, obj):
        parenthoods = obj.parenthoods.all()
        return ParenthoodSerializer(parenthoods, many=True).data

    def to_internal_value(self, data):
        people = data.pop('people', None)
        relationships = data.pop('relationships', None)
        parenthoods = data.pop('parenthoods', None)

        validated_data = super().to_internal_value(data)
        if people is not None:
            validated_data['people'] = people
        if relationships is not None:
            validated_data['relationships'] = relationships
        if parenthoods is not None:
            validated_data['parenthoods'] = parenthoods

        return validated_data

    def create(self, validated_data):
        people = validated_data.pop('people', [])
        relationships = validated_data.pop('relationships', [])
        parenthoods = validated_data.pop('parenthoods', [])

        tree = Tree.objects.create(**validated_data)
        if people:
            tree.people.set(Person.objects.filter(id__in=people))
        if relationships:
            tree.relationships.set(Relationship.objects.filter(id__in=relationships))
        if parenthoods:
            tree.parenthoods.set(Parenthood.objects.filter(id__in=parenthoods))

        return tree

    def update(self, instance, validated_data):
        people = validated_data.pop('people', None)
        relationships = validated_data.pop('relationships', None)
        parenthoods = validated_data.pop('parenthoods', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if people is not None:
            instance.people.set(Person.objects.filter(id__in=people))
        if relationships is not None:
            instance.relationships.set(Relationship.objects.filter(id__in=relationships))
        if parenthoods is not None:
            instance.parenthoods.set(Parenthood.objects.filter(id__in=parenthoods))

        instance.save()
        return instance