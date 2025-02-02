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
            name='Relationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.CharField(choices=[('unformal', 'Unformal'), ('engagement', 'Engagement'), ('marriage', 'Marriage'), ('separation', 'Separation'), ('divorce', 'Divorce')], max_length=20)),
                ('partner1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner1_relationships', to='Person.person')),
                ('partner2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner2_relationships', to='Person.person')),
                ('tree', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relationships', to='Tree.tree')),
            ],
        ),
    ]
