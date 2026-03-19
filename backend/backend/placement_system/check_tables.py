import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SHOW TABLES")
    tables = [row[0] for row in cursor.fetchall()]

# Check for django_session specifically
if 'django_session' in tables:
    print("Table 'django_session' exists.")
else:
    print("Table 'django_session' DOES NOT exist.")

# List all tables
print("\nTables in database:")
for t in tables:
    print(f"- {t}")
