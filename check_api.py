
import requests

url = "http://localhost:8000/companies/jobs/active/"
params = {"email": "jo1@gmail.com", "status": "active"}

try:
    response = requests.get(url, params=params)
    print("Status Code:", response.status_code)
    data = response.json()
    jobs = data.get("jobs", [])
    print("Jobs Count:", len(jobs))
    if len(jobs) > 0:
        for j in jobs:
            print(f"ID: {j['id']} | Title: {j['title']} | Company: {j['company']}")
    else:
        print("NO JOBS FOUND IN API FOR jo1@gmail.com")
        
except Exception as e:
    print("Error calling API:", str(e))
