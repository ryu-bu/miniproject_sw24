This REST API application uses Python Flask. Please follow the below instructions for deployment in the local enviroment. <br>

1. Set up the virual environment
```
python3 -m venv env
```
2. Activate the virtual environment
```
source env/bin/activate
```
3. While using the virtual environment, install dependencies
```
pip install -r requirements.txt
```
4. Add .env file in this directory. Put following into the file:
```
API_KEY=your_fda_api_key
```
5. Run the application
```
python3 app.py
```

<br>

Endpoints:<br>
- /calories-record/
    - GET: Returns the record that contains client's name, email, ingredients, and the total calories. 
    - POST: Accepts JSON and call FDA API to calculate the total calories based on the incoming ingredients. Returns the total calories in its message if successful. Accepts the following JSON format:
    ```
    {
        "name": "string",
        "email": "string",
        "ingredients": ["string1", "string2"]
    }
    ``` 
    Returns the following message:
    ```
    {
        "message": "string",
        "calories": int / float
    }
    ```