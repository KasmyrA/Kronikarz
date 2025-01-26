# Projekt na zaliczenie przedmiotu Inżynieria Oprogramowania

### Prerequisites / Wymagania
- Install MongoDB Community Server: [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)
- Install dependencies:
  ```bash
  npm install  # or pip install -r requirements.txt for Python
  ```


# Endpoint explanation

127.0.0.1:8000/admin
allows user to access admin account and manage the database, users etc.

/persons/ - allows users to access person database, create, edit, erase persons used in tree creation, each function can be accessed with correct head eg. to create a new person object we use POST header. You need access token to use this endpoint.
/persons/<int:pk>/ - used with pk to access, update, delete one person of id pk

/parenthoods/ - endpoint for the access to parenthoods database, as previously stated, the requests need correct header, this endpoint needs access token
/parenthoods/<int:pk>/ - used to access , update, delete one parenthoods object

/relationships/ - endpoint  to access the relationships, correct headers needed, needs access token
/relationships/<int:pk>/ - used to access , update, delete one relationships object

/trees/ - endpoint to access the trees, needs correct headers , needs access token
/trees/<int:pk>/ - used to access , update, delete one trees object


/users/ - endpoint used to access and manage the users, this include login, registering
/users/<int:pk>/ used to access one particular user, the id of the user is acquired after logging in

explanation
/users/token - if used with correct login and password generated access and refresh token 

/users/token/refresh - generates new access key after the expiry of previous one, you need to include the "refresh": "refresh__key"  where you replace refresh_key with your actual key.

Token is used as login
token and token/refresh do not need authorization

/users/logout - used to void the access key, afterwards you need to generate new access key through login

/users/ - with POST header, used to register new account, it needs username, email and password for the user to be created, does not need authorization

To test the endpoints and generate report use the following command 

pytest Authorizationtest.py --junitxml=C:\test\out_report.xml

the report will be generated in test folder on C: drive, if you want the report to generate to different location, edit the junitxml path

you also need to include new files and existing objects in order to create the new person, parenthoods, relationships for the purpose of testing