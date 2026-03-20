
import os
import django
import sys

sys.path.append(r'd:\Placement Portal\backend\backend\placement_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

from students.models import Student

print("--- ALL STUDENT EMAILS ---")
for s in Student.objects.all():
    print(f"'{s.email}'")

print("\n--- DONE ---")
