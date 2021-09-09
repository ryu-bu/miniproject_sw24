from flask import Flask, jsonify
from flask_restful import Api
from resources.Ingredients import Ingredients

app = Flask(__name__)
api = Api(app)

api.add_resource(Ingredients, '/calories-record')
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)