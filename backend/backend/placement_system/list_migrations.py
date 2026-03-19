import pymysql

try:
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='placement_system',
        port=3306
    )
    with conn.cursor() as cursor:
        cursor.execute("SELECT app, name FROM django_migrations")
        migrations = cursor.fetchall()
        print("Applied migrations in django_migrations table:")
        for app, name in migrations:
            print(f" - {app}: {name}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
