from django.contrib import admin
from .models import EventInLife
from .models import Surname
from .models import Job
from .models import FileInfo
from .models import Person

admin.site.register(EventInLife)
admin.site.register(Surname)
admin.site.register(Job)
admin.site.register(FileInfo)
admin.site.register(Person)