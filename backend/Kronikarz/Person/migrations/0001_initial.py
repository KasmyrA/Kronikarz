# Generated by Django 5.1.2 on 2025-01-21 09:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Tree', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventInLife',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.CharField(blank=True, max_length=255, null=True)),
                ('place', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='files/')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('place', models.CharField(max_length=255)),
                ('from_date', models.CharField(max_length=255)),
                ('untill_date', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Surname',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('surname', models.CharField(max_length=255)),
                ('untill', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('names', models.JSONField()),
                ('description', models.TextField(blank=True, null=True)),
                ('sex', models.CharField(blank=True, choices=[('F', 'Female'), ('M', 'Male')], max_length=1, null=True)),
                ('x', models.FloatField()),
                ('y', models.FloatField()),
                ('birth', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='birth', to='Person.eventinlife')),
                ('death', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='death', to='Person.eventinlife')),
                ('files', models.ManyToManyField(blank=True, to='Person.file')),
                ('image', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Person.image')),
                ('jobs', models.ManyToManyField(blank=True, to='Person.job')),
                ('tree', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='people', to='Tree.tree')),
                ('surnames', models.ManyToManyField(to='Person.surname')),
            ],
        ),
    ]
