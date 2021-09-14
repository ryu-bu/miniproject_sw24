from flask_restful import Resource
from flask import request, jsonify
import requests, os
from dotenv import load_dotenv

class Ingredients(Resource):
    client_record = []
    key = ""
    url_template = "https://api.nal.usda.gov/fdc/v1/foods/search?pageSize=1&query="

    def __init__(self):
        load_dotenv()
        self.key = os.getenv('API_KEY')

    def get(self):
        return jsonify(self.client_record)

    def post(self):
        arg = request.args
        post_method = arg['type']
        servings = int(arg['servings'])
        item = request.get_json()

        calories = 0
        record_type = ""
        product_name = ""
        ingredient_list = []

        if not post_method:
            return {"message": "no type"}

        if not servings:
            return {"message": "no serving"}

        if not item:
            return {"message": "no input"}

        if post_method == "barcode":
            barcode = item['barcode']

            calories, product_name = self._get_calories(barcode)
            record_type = "product"

        if post_method == "ingredients":
            ingredient_list = item["ingredients"]
            for ingredient in ingredient_list:
                calorie, product_name = self._get_calories(ingredient)
                calories += calorie
            record_type = "ingredients"

        total_calories = calories * servings

        self.client_record.append({
            "name": item["name"],
            "email": item["email"],
            "type": record_type,
            "product_name": product_name,
            "ingredients": ingredient_list,
            "servings": servings,
            "total_calories": total_calories
        })

        return {"message": "success", "calories": total_calories, "product_name": product_name}, 201

    def _get_calories(self, name):
        calories = 0
        url = f"{self.url_template}{name}&api_key={self.key}"
        r = requests.get(url)
        food = r.json()["foods"][0]
        product_name = food["description"]
        for nutrient in food["foodNutrients"]:
            if nutrient["nutrientName"] == "Energy":
                calories += int(nutrient["value"])

        return (calories, product_name)