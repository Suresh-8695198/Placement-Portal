
import os
import django
import sys

# Add the project path to sys.path
sys.path.append(r'd:\Placement Portal\backend\backend\placement_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

from students.models import Student
from companies.models import Job

print("--- Students ---")
for s in Student.objects.all():
    print(f"ID: {s.id} | Email: {s.email} | Dept: {s.department} | Prog: {s.programme} | Year: {s.passed_out_year}")

print("\n--- Jobs (Active) ---")
for j in Job.objects.filter(is_active=True):
    print(f"ID: {j.id} | Title: {j.title} | Company: {j.company.name} | Depts: {j.departments} | Progs: {j.programmes} | Years: {j.graduation_years}")
