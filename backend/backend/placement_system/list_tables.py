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
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print("Existing tables:")
        for (table,) in tables:
            print(f" - {table}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
