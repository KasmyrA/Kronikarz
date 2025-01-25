import pytest
import requests

BASE_URL = "http://127.0.0.1:8000"


access_token = ""
refresh_token = ""
tree_id = None

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