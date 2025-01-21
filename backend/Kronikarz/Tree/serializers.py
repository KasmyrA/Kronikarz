from rest_framework import serializers
from Person.models import Person
from Relationship.models import Relationship
from Parenthood.models import Parenthood
from .models import Tree
from Parenthood.serializers import ParenthoodSerializer
from Relationship.serializers import RelationshipSerializer
from Person.serializers import PersonSerializer, ImageSerializer


class TreePersonSerializer(serializers.ModelSerializer):
    birthDate = serializers.CharField(source='birth.date')
    deathDate = serializers.CharField(source='death.date', allow_null=True)
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()
    image = ImageSerializer(required=False, allow_null=True)

    class Meta:
        model = Person
        fields = ['id', 'name', 'surname', 'sex', 'image', 'birthDate', 'deathDate', 'x', 'y']

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
        fields = ['uid', 'id', 'name', 'people', 'relationships', 'parenthoods']

    def get_people(self, obj):
        people = obj.people.all()
        serializer = TreePersonSerializer(people, many=True, context={'tree': obj})
        return serializer.data

    def get_relationships(self, obj):
        relationships = obj.relationships.all()
        return RelationshipSerializer(relationships, many=True).data

    def get_parenthoods(self, obj):
        parenthoods = obj.parenthoods.all()
        return ParenthoodSerializer(parenthoods, many=True).data

    def create(self, validated_data):
        people_data = validated_data.pop('people', [])
        relationships_data = validated_data.pop('relationships', [])
        parenthoods_data = validated_data.pop('parenthoods', [])

        tree = Tree.objects.create(**validated_data)

        for person_data in people_data:
            Person.objects.create(tree=tree, **person_data)
        for relationship_data in relationships_data:
            Relationship.objects.create(tree=tree, **relationship_data)
        for parenthood_data in parenthoods_data:
            Parenthood.objects.create(tree=tree, **parenthood_data)

        return tree

    def update(self, instance, validated_data):
        people_data = validated_data.pop('people', None)
        relationships_data = validated_data.pop('relationships', None)
        parenthoods_data = validated_data.pop('parenthoods', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if people_data is not None:
            instance.people.all().delete()
            for person_data in people_data:
                Person.objects.create(tree=instance, **person_data)

        if relationships_data is not None:
            instance.relationships.all().delete()
            for relationship_data in relationships_data:
                Relationship.objects.create(tree=instance, **relationship_data)

        if parenthoods_data is not None:
            instance.parenthoods.all().delete()
            for parenthood_data in parenthoods_data:
                Parenthood.objects.create(tree=instance, **parenthood_data)

        return instance