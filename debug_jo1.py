
import os
import django
import sys

# Add the project path to sys.path
sys.path.append(r'd:\Placement Portal\backend\backend\placement_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

from students.models import Student
from companies.models import Job

print("--- Checking jo1@gmail.com ---")
s = Student.objects.filter(email='jo1@gmail.com').first()
if s:
    print(f"Name: {s.name} | Dept: {s.department} | Prog: {s.programme} | Year: {s.passed_out_year}")
else:
    print("Student jo1@gmail.com NOT found in Student table!")

print("\n--- Checking Active Job ---")
# Get the most recent active job
j = Job.objects.filter(is_active=True).last()
if j:
    print(f"Title: {j.title} | Depts: {j.departments} | Progs: {j.programmes} | Years: {j.graduation_years}")
else:
    print("No active jobs found!")
