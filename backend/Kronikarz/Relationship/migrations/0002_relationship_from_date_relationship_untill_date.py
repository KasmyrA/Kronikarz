# Generated by Django 5.1.2 on 2025-01-22 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Relationship', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='relationship',
            name='from_date',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='relationship',
            name='untill_date',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
