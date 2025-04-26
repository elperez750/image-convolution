from flask import Flask,  jsonify, request
from flask_cors import CORS
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)


def convert_image_to_np(file_object):
    img = Image.open(file_object).convert('L')

    
    if hasattr(img, 'format') and img.format == 'HEIC':
        img = img.convert('RGB')

    img_array = np.array(img)
    return img_array

@app.route('/upload_image', methods=['POST'])
def upload_image():
    img_object = request.files['image']
    img_array = convert_image_to_np(img_object)
    return jsonify({"message": "API is working!"})