# Projekt na zaliczenie przedmiotu Inżynieria Oprogramowania

### Prerequisites / Wymagania
- Install MongoDB Community Server: [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)
- Install dependencies:
  ```bash
  npm install  # or pip install -r requirements.txt for Python
  ```

### Further installation / Dalszy ciąg instalacji
After installing the MongoDB server and creating a connection, we should create a database named Kronikarz and add 4 following collections to it:
persons, parenthoods,relationships,trees. Afterwards you need to import the coresponding .json files from Database folder to your MongoDB database collections.
If you want to make your own connection that is not on port 27017 or use database with different name, change the name and link to the MongoDB connection in db_connection.py file
To execute the urls in the backend you can have to use curl commands that are compatible with the program, below are the examples of curl commands for each datatype.

### Trees

# GET all trees

curl --location '127.0.0.1:8000/trees/'

# GET one tree

curl --location '127.0.0.1:8000/trees/6762e0a99bd615fb0286955d/3/'

# PUT update one tree

curl --location --request PUT '127.0.0.1:8000/trees/update/6762e0a99bd615fb0286955d/2/' \
--header 'Content-Type: text/plain' \
--data '{
    "name": "Updated Smith Family Tree3",
    "people": [
        
        {
            "id": 2,
            "name": "Jane",
            "surname": "Doe",
            "sex": "F",
            "imageUrl": "https://example.com/images/jane_doe_updated.jpg",
            "birthDate": "1983-07-20",
            "deathDate": "",
            "position": {
                "x": 1,
                "y": 0
            }
        }
    ],
    "relationships": [
        {
            "id": 1,
            "parrner1": 1,
            "partner2": 2,
            "kind": "marriage"
        }
    ],
    "parenthoods": [
        {
            "parentId": 1,
            "childId": 3
        },
        {
            "parentId": 2,
            "childId": 3
        }
    ]
}
'

# PUT create one tree

curl --location --request PUT '127.0.0.1:8000/trees/create/6762e0a99bd615fb0286955d/' \
--header 'Content-Type: text/plain' \
--data '{
    "name": "New Family Tree",
    "people": [
        {
            "id": 5,
            "name": "James",
            "surname": "Doe",
            "sex": "M",
            "imageUrl": "https://example.com/images/james_doe.jpg",
            "birthDate": "1975-12-02",
            "deathDate": "",
            "position": {
                "x": 0,
                "y": 0
            }
        },
        {
            "id": 6,
            "name": "Sophia",
            "surname": "Green",
            "sex": "F",
            "imageUrl": null,
            "birthDate": "1978-10-16",
            "deathDate": "",
            "position": {
                "x": 1,
                "y": 0
            }
        },
        {
            "id": 7,
            "name": "Liam",
            "surname": "Doe",
            "sex": "M",
            "imageUrl": null,
            "birthDate": "2000-05-05",
            "deathDate": "",
            "position": {
                "x": 0,
                "y": 1
            }
        }
    ],
    "relationships": [
        {
            "id": 2,
            "parrner1": 5,
            "partner2": 6,
            "kind": "marriage"
        }
    ],
    "parenthoods": [
        {
            "parentId": 5,
            "childId": 7
        },
        {
            "parentId": 6,
            "childId": 7
        }
    ]
}'

# DELETE delete one tree

curl --location --request DELETE '127.0.0.1:8000/trees/delete/6762e0a99bd615fb0286955d/2/'

### Relationships

# GET get all relationships

curl --location '127.0.0.1:8000/relationships/'

# GET get one relationship

curl --location '127.0.0.1:8000/relationships/676300669bd615fb02869564/1'

# PUT update one relationship

curl --location --request PUT 'http://127.0.0.1:8000/relationships/update/676300669bd615fb02869564/2/' \
--header 'Content-Type: text/plain' \
--data '{
    "kind": "formal",
    "partner2": 5
}'

# POST create one relationship

curl --location '127.0.0.1:8000/relationships/trees' \
--header 'Content-Type: text/plain' \
--data '{
    "partner1": 3,
    "partner2": 6,
    "kind": "friendship",
    "date": "2024-12-18"
}'

# DELETE delete one relationship

curl --location --request DELETE '127.0.0.1:8000/relationships/delete/676300669bd615fb02869564/1/'