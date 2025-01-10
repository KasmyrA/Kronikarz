from django.db import models
from django.contrib.auth.models import User

class EventInLife(models.Model):
    date = models.CharField(max_length=255)
    place = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.date} - {self.place}"


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


class FileInfo(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    file_id = models.IntegerField(unique=True)

    def __str__(self):
        return self.name


class Person(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    names = models.JSONField()
    image = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    sex = models.CharField(max_length=1, choices=[('F', 'Female'), ('M', 'Male')], null=True, blank=True)
    birth = models.OneToOneField(EventInLife, related_name='birth', on_delete=models.CASCADE)
    death = models.OneToOneField(EventInLife, related_name='death', on_delete=models.CASCADE, null=True, blank=True)
    surnames = models.ManyToManyField(Surname)
    jobs = models.ManyToManyField(Job, blank=True)
    files = models.ManyToManyField(FileInfo, blank=True)

    def __str__(self):
        names_str = " ".join(self.names) if self.names else ""
        surnames_str = " ".join([surname.surname for surname in self.surnames.all()])
        return f"{names_str} {surnames_str}".strip()
