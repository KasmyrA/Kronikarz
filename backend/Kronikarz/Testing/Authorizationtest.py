import pytest
import requests

BASE_URL = "http://127.0.0.1:8000"


access_token = ""
refresh_token = ""
user_id = None
tree_id = None
person_id = None
relationship_id = None
parenthoods_id = None


# testowanie endpointów rejestracji i logowania

def test_register():
    
    payload = {
        "username": "tester34",
        "email": "tester34@gmail.com",
        "password": "Zaq12wsx"
    }

    
    response = requests.post(
        url=f"{BASE_URL}/users/",
        headers={"Content-Type": "application/json"},
        json=payload  
    )

    
    print(f"Status Code: {response.status_code}")
    print(response.status_code)
    
    assert response.status_code == 201  
    response_data = response.json()
    user_id = response_data["id"]
    assert response_data.get("username") == "tester34"
    assert response_data.get("email") == "tester34@gmail.com"




def test_login():
    global access_token, refresh_token  
    payload = {
        "username": "tester34",
        "password": "Zaq12wsx"
    }
    response = requests.post(
        url=f"{BASE_URL}/users/token/",
        headers={"Content-Type": "application/json"},
        json=payload
    )

    assert response.status_code == 200
    response_data = response.json()
    assert "access" in response_data
    assert "refresh" in response_data

    access_token = response_data["access"]
    refresh_token = response_data["refresh"]

    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")

    # testowanie endpointów drzewa


def test_create_trees():
    global access_token, tree_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    payload = {
        "uid": 2,  
        "name": "Moje drzewo"
    }

   
    response = requests.post(
        url=f"{BASE_URL}/trees/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )
    
    response_data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response_data}")

    assert response.status_code == 201, "Tree creation failed."
    
    
    assert "id" in response_data, "Response does not contain 'id'."
    tree_id = response_data["id"]

    print(f"Created tree ID: {tree_id}")

def test_get_trees():
    global access_token

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    
    response = requests.get(
        url=f"{BASE_URL}/trees/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_trees():
    global access_token, tree_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert tree_id, "Tree ID is not set. Please make sure the create test runs first."

    payload = {
        "uid": 2, 
        "name": "Moje drzewo424242"
    }

   
    response = requests.put(
        url=f"{BASE_URL}/trees/{tree_id}/",  
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, f"Failed to update tree: {response.status_code}"

def test_delete_trees():
    global access_token, tree_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert tree_id, "Tree ID is not set. Please make sure the create test runs first."

    
    response = requests.delete(
        url=f"{BASE_URL}/trees/{tree_id}/",  
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    assert response.status_code == 204, f"Failed to delete tree: {response.status_code}"



    # testing relationship CRUD

def test_create_relationship():
    global access_token, relationship_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    payload = {
    "tree": 50,
    "kind": "marriage",
    "from_date": "01.01.2020",
    "untill_date": "01.01.2021",
    "partner1": 20,
    "partner2": 20
    }

   
    response = requests.post(
        url=f"{BASE_URL}/relationships/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )
    
    response_data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response_data}")

    assert response.status_code == 201, "Tree creation failed."
    
    
    assert "id" in response_data, "Response does not contain 'id'."
    relationship_id = response_data["id"]

    print(f"Created tree ID: {tree_id}")

def test_get_relationships():
    global access_token

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    
    response = requests.get(
        url=f"{BASE_URL}/relationships/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_relationship():
    global access_token, relationship_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert relationship_id, "Tree ID is not set. Please make sure the create test runs first."

    payload = {
    "tree": 50,
    "kind": "divorce",
    "from_date": "01.01.2020",
    "untill_date": "01.01.2021" ,
    "partner1": 20,
    "partner2": 20
    }

   
    response = requests.put(
        url=f"{BASE_URL}/relationships/{relationship_id}/",  
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, f"Failed to update tree: {response.status_code}"

def test_delete_relationship():
    global access_token, relationship_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert relationship_id, "Tree ID is not set. Please make sure the create test runs first."

    
    response = requests.delete(
        url=f"{BASE_URL}/relationships/{relationship_id}/",  
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    assert response.status_code == 204, f"Failed to delete tree: {response.status_code}"



    
    # tests for person crud

def test_create_person():
    global access_token, person_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    payload = {
    "tree": 50,
    "birth": {
        "id": 38,
        "date": "01.01.1990",
        "place": "Warszawa"
    },
    "death": {
        "id": 39,
        "date": "01.01.2025",
        "place": "Katowice"
    },
    "surnames": [
        {
            "id": 17,
            "surname": "Kowalski",
            "untill": "01.01.2021"
        }
    ],
    "jobs": [
        {
            "id": 13,
            "name": "Informatyk",
            "place": "Warszawa",
            "from_date": "01.02.2015",
            "untill_date": "01.01.2021"
        }
    ],
    "files": [
        17
    ],
    "names": [
        "Jan",
        "Adam"
    ],
    "description": "Pan Jan.",
    "sex": "M",
    "x": 1.0,
    "y": 1.0,
    "image": 17
}

   
    response = requests.post(
        url=f"{BASE_URL}/persons/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )
    
    response_data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response_data}")

    assert response.status_code == 201
    
    
    assert "id" in response_data, "Response does not contain 'id'."
    person_id = response_data["id"]

    print(f"Created tree ID: {person_id}")
    return response_data


def test_get_persons():
    global access_token

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    
    response = requests.get(
        url=f"{BASE_URL}/persons/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_persons():
    global access_token, person_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert person_id, "Person ID is not set. Please make sure the create test runs first."

    payload ={
    "tree": 50,
    "birth": {
        "date": "01.01.1990",
        "place": "Warszawa"
    },
    "death": {
        "date": "01.01.2025",
        "place": "Katowice"
    },
    "surnames": [
        {
            "surname": "Kowalski 2",
            "untill": "01.02.2016"
        }
    ],
    "jobs": [
        {
            "name": "Informatyk",
            "place": "Warszawa",
            "from_date": "01.02.2015",
            "untill_date": "01.03.2016"
        }
    ],
    "files": [
        17
    ],
    "names": [
        "Jan 2",
        "Adam"
    ],
    "description": "Pan Jan 2.",
    "sex": "M",
    "x": 1.0,
    "y": 1.0,
    "image": 17
    }


   
    response = requests.put(
        url=f"{BASE_URL}/persons/{person_id}/",  
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, f"Failed to update tree: {response.status_code}"

def test_delete_person():
    global access_token, person_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert person_id, "Person ID is not set. Please make sure the create test runs first."

    
    response = requests.delete(
        url=f"{BASE_URL}/persons/{person_id}/",  
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    assert response.status_code == 204, f"Failed to delete tree: {response.status_code}"
    


# testing parenthoods CRUD

def test_create_parenthoods():
    global access_token, parenthoods_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    payload = {
    "tree": 50,
    "type": "biological",
    "start_date": "2001-01-01",
    "end_date": "2001-01-02",
    "adoption_date": "2001-02-01",
    "mother": 20,
    "father": 20,
    "child": 20,
    "adoption_mother": 20,
    "adoption_father": 20
    }


   
    response = requests.post(
        url=f"{BASE_URL}/parenthoods/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )
    
    response_data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response_data}")

    assert response.status_code == 201
    
    
    assert "id" in response_data, "Response does not contain 'id'."
    parenthoods_id = response_data["id"]

    print(f"Created tree ID: {parenthoods_id}")

def test_get_parenthoods():
    global access_token

    assert access_token, "Access token is not set. Please make sure the login test runs first."

    
    response = requests.get(
        url=f"{BASE_URL}/parenthoods/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_parenthood():
    global access_token, parenthoods_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert parenthoods_id, "Tree ID is not set. Please make sure the create test runs first."

    payload = {
    "tree": 50,
    "type": "biological",
    "start_date": "2001-01-07",
    "end_date": "2001-01-06",
    "adoption_date": "2001-02-05",
    "mother": 20,
    "father": 20,
    "child": 20,
    "adoption_mother": 20,
    "adoption_father": 20
    }

   
    response = requests.put(
        url=f"{BASE_URL}/parenthoods/{parenthoods_id}/",  
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, f"Failed to update tree: {response.status_code}"

def test_delete_parenthood():
    global access_token, parenthoods_id  

    assert access_token, "Access token is not set. Please make sure the login test runs first."
    assert parenthoods_id, "Tree ID is not set. Please make sure the create test runs first."

    
    response = requests.delete(
        url=f"{BASE_URL}/parenthoods/{parenthoods_id}/",  
        headers={"Authorization": f"Bearer {access_token}"}
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    assert response.status_code == 204, f"Failed to delete tree: {response.status_code}"