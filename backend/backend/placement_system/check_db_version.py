import pymysql
import os

try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='placement_system',
        port=3306
    )
    with conn.cursor() as cursor:
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        print(f"MariaDB Version: {version[0]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
