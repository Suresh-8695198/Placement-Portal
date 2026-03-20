
import os
import django
import sys

sys.path.append(r'd:\Placement Portal\backend\backend\placement_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

from companies.models import Job
from students.models import Student

# Look for the "Software Developer" job
j = Job.objects.filter(title__icontains='Software Developer').first()
if j:
    print(f"--- Job {j.id}: {j.title} ---")
    print(f"Active: {j.is_active}")
    print(f"Approved: {getattr(j, 'is_approved', 'N/A')}")
    print(f"Depts: {j.departments}")
    print(f"Progs: {j.programmes}")
    print(f"Years: {j.graduation_years}")
    print(f"Apply By: {j.last_date_to_apply}")
else:
    print("Job not found!")

# Check student jo1
s = Student.objects.get(email='jo1@gmail.com')
print(f"\n--- Student {s.email} ---")
print(f"Dept: '{s.department}'")
print(f"Prog: '{s.programme}'")
print(f"Year: {s.passed_out_year}")
