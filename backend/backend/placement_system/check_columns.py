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
        cursor.execute("DESCRIBE companies_job")
        columns = cursor.fetchall()
        print("Columns in companies_job:")
        for col in columns:
            print(f" - {col[0]}")
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
