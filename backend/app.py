from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/upload_image', methods=['GET'])
def upload_image():
    print("Received request to upload image")
    return jsonify({"message": "API is working!"})