from rest_framework import serializers
from Person.models import Person
from Relationship.models import Relationship
from Parenthood.models import Parenthood
from .models import Position, Tree
from Parenthood.serializers import ParenthoodSerializer
from Relationship.serializers import RelationshipSerializer

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
    image = serializers.ImageField(required=False, allow_null=True)

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
    people = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Person.objects.all(), required=False
    )
    relationships = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Relationship.objects.all(), required=False, write_only=True
    )
    parenthoods = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Parenthood.objects.all(), required=False, write_only=True
    )
    relationships_details = RelationshipSerializer(
        many=True, read_only=True, source='relationships'
    )
    parenthoods_details = ParenthoodSerializer(
        many=True, read_only=True, source='parenthoods'
    )

    class Meta:
        model = Tree
        fields = [
            'uid', 'id', 'name', 'people',
            'relationships', 'relationships_details',
            'parenthoods', 'parenthoods_details'
        ]

    def create(self, validated_data):
        people = validated_data.pop('people', [])
        relationships = validated_data.pop('relationships', [])
        parenthoods = validated_data.pop('parenthoods', [])
        
        tree = Tree.objects.create(**validated_data)
        tree.people.set(people)
        tree.relationships.set(relationships)
        tree.parenthoods.set(parenthoods)
        return tree

    def update(self, instance, validated_data):
        people = validated_data.pop('people', None)
        relationships = validated_data.pop('relationships', None)
        parenthoods = validated_data.pop('parenthoods', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if people is not None:
            instance.people.set(people)
        if relationships is not None:
            instance.relationships.set(relationships)
        if parenthoods is not None:
            instance.parenthoods.set(parenthoods)

        instance.save()
        return instance