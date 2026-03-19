import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'placement_system.settings')
django.setup()

with connection.cursor() as cursor:
    # Check if a migration for 'sessions' is in django_migrations
    cursor.execute("SELECT id FROM django_migrations WHERE app = 'sessions'")
    row = cursor.fetchone()
    if row:
        print(f"Found existing migration for 'sessions' (ID: {row[0]}). Deleting...")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'sessions'")
        print("Deleted.")
    else:
        print("No migration for 'sessions' found in django_migrations.")

with connection.cursor() as cursor:
    # Just to be safe, check sessions specifically
    # If sessions is missing, running migrate sessions should create it if migrations table has no row for it.
    pass
