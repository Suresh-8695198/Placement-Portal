import os
import django
from django.core.management import call_command
from io import StringIO

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

out = StringIO()
call_command('showmigrations', stdout=out)
print(out.getvalue())
