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
        with open('tables_output.txt', 'w') as f:
            for (table,) in tables:
                f.write(table + '\n')
            
    conn.close()
    print("Tables written to tables_output.txt")
except Exception as e:
    print(f"Error: {e}")
