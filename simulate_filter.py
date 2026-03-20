
import os
import django
import sys

sys.path.append(r'd:\Placement Portal\backend\backend\placement_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

from students.models import Student
from companies.models import Job

s = Student.objects.get(email='jo1@gmail.com')
print(f"--- Student {s.email} ---")
print(f"Name: {s.name}")
print(f"Dept: '{s.department}'")
print(f"Prog: '{s.programme}'")
print(f"Year: {s.passed_out_year}")

print("\n--- Jobs (Active Only) ---")
for j in Job.objects.filter(is_active=True):
    print(f"--- Job {j.id}: {j.title} ---")
    print(f"Depts: {j.departments}")
    print(f"Progs: {j.programmes}")
    print(f"Years: {j.graduation_years}")
    print(f"ShowAllDepts: {j.show_to_all_departments}")
    
    # Simulate the check in get_active_jobs
    if j.show_to_all_departments or s.department in (j.departments or []) or "ALL" in (j.departments or []):
        dept_match = True
    else:
        dept_match = False
        
    year = s.passed_out_year
    if year in (j.graduation_years or []) or "ALL" in (j.graduation_years or []):
        year_match = True
    else:
        year_match = False
        
    prog = s.programme
    if prog in (j.programmes or []) or "ALL" in (j.programmes or []) or not j.programmes:
        prog_match = True
    else:
        prog_match = False
        
    print(f"Dept Match: {dept_match} | Year Match: {year_match} | Prog Match: {prog_match}")
