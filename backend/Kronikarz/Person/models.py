from django.db import models
from django.contrib.auth.models import User
from Tree.models import Tree
from django.db.models.signals import pre_save, pre_delete, post_delete
from django.dispatch import receiver
import os

class EventInLife(models.Model):
    date = models.CharField(max_length=255, null=True, blank=True)
    place = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        date_display = self.date if self.date else "___"
        place_display = self.place if self.place else "___"
        return f"{date_display} - {place_display}"


class Surname(models.Model):
    surname = models.CharField(max_length=255)
    untill = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        if self.untill:
            return f"{self.surname} (untill {self.untill})"
        else:
            return self.surname

class Job(models.Model):
    name = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    from_date = models.CharField(max_length=255)
    untill_date = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.name} at {self.place}"


# File

class File(models.Model):
    file = models.FileField(upload_to='files/')

    def __str__(self):
        return self.file.name
    
@receiver(pre_save, sender=File)
def delete_file_on_model_update(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_file = File.objects.get(pk=instance.pk).file
    except File.DoesNotExist:
        return
    else:
        if old_file and old_file != instance.file and old_file.path and os.path.isfile(old_file.path):
            os.remove(old_file.path)

@receiver(pre_delete, sender=File)
def delete_file_on_model_delete(sender, instance, **kwargs):
    if instance.file and os.path.isfile(instance.file.path):
        os.remove(instance.file.path)

# Image

class Image(models.Model):
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.image.name

@receiver(pre_save, sender=Image)
def delete_image_on_model_update(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_image = Image.objects.get(pk=instance.pk).image
    except Image.DoesNotExist:
        return
    else:
        if old_image and old_image != instance.image and old_image.path and os.path.isfile(old_image.path):
            os.remove(old_image.path)


@receiver(pre_delete, sender=Image)
def delete_image_on_model_delete(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)

class Person(models.Model):
    tree = models.ForeignKey(Tree, on_delete=models.CASCADE, related_name='people')
    names = models.JSONField()
    image = models.OneToOneField(Image, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    sex = models.CharField(max_length=1, choices=[('F', 'Female'), ('M', 'Male')], null=True, blank=True)
    birth = models.OneToOneField(EventInLife, related_name='birth', on_delete=models.SET_NULL, null=True)
    death = models.OneToOneField(EventInLife, related_name='death', on_delete=models.SET_NULL, null=True, blank=True)
    surnames = models.ManyToManyField(Surname)
    jobs = models.ManyToManyField(Job, blank=True)
    files = models.ManyToManyField(File, blank=True)
    x = models.FloatField()
    y = models.FloatField()

    def __str__(self):
        names_str = " ".join(self.names) if self.names else ""
        surnames_str = " ".join([surname.surname for surname in self.surnames.all()])
        return f"{names_str} {surnames_str}".strip()
    

@receiver(post_delete, sender=Person)
def delete_related_objects(sender, instance, **kwargs):
    if instance.birth:
        instance.birth.delete()
    if instance.death:
        instance.death.delete()
    instance.surnames.all().delete()
    instance.jobs.all().delete()
    instance.files.all().delete()
    if instance.image:
        instance.image.delete()