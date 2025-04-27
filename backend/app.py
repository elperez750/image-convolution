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


def gaussian_blur(image, kernel_size):
    Y, X = np.meshgrid(np.linspace(-3, 3, kernel_size), np.linspace(-3, 3, kernel_size))
    kernel = np.exp(-(X**2 + Y**2) / 7)
    kernel /= np.sum(kernel)

    half_kernel = kernel_size // 2

    padded_image = np.pad(image, pad_width=1)

    conv_output = np.zeros_like(image)
    
    for i in range(half_kernel, image.shape[0]-half_kernel):
        for j in range(half_kernel, image.shape[1]-half_kernel):
            # Perform convolution
            piece = padded_image[i-half_kernel:i+half_kernel+1, j-half_kernel: j+half_kernel+1]
            total = np.sum(kernel * piece)
            conv_output[i-1, j-1] = total

    return conv_output





@app.route('/upload_image', methods=['POST'])
def upload_image():
    print("API is working!")
    img_object = request.files['image']
    img_array = convert_image_to_np(img_object)
    gaussian_blurred_image = gaussian_blur(img_array, 51)
    img_to_show = gaussian_blurred_image

    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
        img_pil = Image.fromarray(img_to_show)

        # Show the image
        img_pil.show()

    return jsonify({"message": "API is working!"})