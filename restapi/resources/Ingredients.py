from flask_restful import Resource
from flask import request, jsonify
import requests

class Ingredients(Resource):
    client_record = []
    key = "8Go1adfzZpm9tD0UpPu1X2WW5enGqSehh3eouKIl"
    url_template = "https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=1&query="

    def get(self):
        return jsonify(self.client_record)

    def post(self):
        arg = request.args
        servings = int(arg['servings'])
        item = request.get_json()

        calories = 0

        if not servings:
            return {"message": "no serving"}

        if not item:
            return {"message": "no input"}

        for ingredient in item["ingredients"]:
            url = f"{self.url_template}{ingredient}&api_key={self.key}"
            r = requests.get(url)
            food = r.json()["foods"][0]
            for nutrient in food["foodNutrients"]:
                if nutrient["nutrientName"] == "Energy":
                    calories += nutrient["value"]

        print(calories)
        total_calories = calories * servings

        self.client_record.append({
            "name": item["name"],
            "email": item["email"],
            "ingredients": item["ingredients"],
            "servings": servings,
            "total_calories": total_calories
        })

        return {"message": "success", "calories": total_calories}, 201