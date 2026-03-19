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
        print("--- All Tables ---")
        cursor.execute("SHOW TABLES")
        for (table,) in cursor.fetchall():
            print(f" - {table}")
        
        print("\n--- Student Related Tables ---")
        cursor.execute("SHOW TABLES LIKE 'students_%'")
        for (table,) in cursor.fetchall():
            print(f" - {table}")
            
        print("\n--- Migrations for 'students' ---")
        cursor.execute("SELECT name, applied FROM django_migrations WHERE app = 'students'")
        for name, applied in cursor.fetchall():
            print(f" - {name} (Applied: {applied})")
            
    conn.close()
except Exception:
    import traceback
    traceback.print_exc()
