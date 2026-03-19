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
        rows = cursor.fetchall()
        print("Applied migrations in database (app - name):")
        for (app, name) in rows:
            print(f" - {app} - {name}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
