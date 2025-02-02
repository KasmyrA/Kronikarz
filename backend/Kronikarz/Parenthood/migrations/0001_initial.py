# Generated by Django 5.1.2 on 2025-01-21 09:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Person', '0001_initial'),
        ('Tree', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parenthood',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('biological', 'Biological'), ('adoptive', 'Adoptive')], max_length=10)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('adoption_date', models.DateField(blank=True, null=True)),
                ('adoption_father', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adoption_father_parenthoods', to='Person.person')),
                ('adoption_mother', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adoption_mother_parenthoods', to='Person.person')),
                ('child', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='child_parenthoods', to='Person.person')),
                ('father', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='father_parenthoods', to='Person.person')),
                ('mother', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mother_parenthoods', to='Person.person')),
                ('tree', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parenthoods', to='Tree.tree')),
            ],
        ),
    ]
