from flask import Flask,  jsonify, request
from flask_cors import CORS
from PIL import Image
import numpy as np
from scipy.signal import convolve2d

app = Flask(__name__)
CORS(app)


def convert_image_to_np(file_object):
    img = Image.open(file_object)

    

    if hasattr(img, 'format') and img.format == 'HEIC':
        img = img.convert('RGB')

    img_array = np.array(img)

    R = img_array[:, :, 0]
    G = img_array[:, :, 1]
    B = img_array[:, :, 2]
    return R, G, B


def gaussian_blur(image, kernel_size):
    Y, X = np.meshgrid(np.linspace(-3, 3, kernel_size), np.linspace(-3, 3, kernel_size))
    kernel = np.exp(-(X**2 + Y**2) / kernel_size)

    # Normalize the kernel
    kernel /= np.sum(kernel)

    half_kernel = kernel_size // 2

    padded_image = np.pad(image, pad_width=1)

    conv_output = np.zeros_like(image)
    
    '''
    for i in range(half_kernel, image.shape[0]-half_kernel):
        for j in range(half_kernel, image.shape[1]-half_kernel):
            # Perform convolution
            piece = padded_image[i-half_kernel:i+half_kernel+1, j-half_kernel: j+half_kernel+1]
            total = np.sum(kernel * piece)
            conv_output[i-1, j-1] = total

    return conv_output
    '''
    output = convolve2d(image, kernel, mode='same')
    return output


def sharpen_kernel(image):
    kernel = np.array(
         [
            [0, -1, 0],
            [-1, 9, -1],
            [0, -1, 0]
         ]
     )
    
   
   
    half_kernel = kernel.shape[0] //2
    padded_image = np.pad(image, pad_width=1)
    conv_output = np.zeros_like(image)
    '''
    for i in range(half_kernel, image.shape[0]-half_kernel):
        for j in range(half_kernel, image.shape[1]-half_kernel):
            # Perform convolution
            piece = padded_image[i-half_kernel:i+half_kernel+1, j-half_kernel: j+half_kernel+1]
            total = np.sum(kernel * piece)
            conv_output[i-1, j-1] = total
   '''
   
    output = convolve2d(image, kernel, mode='same')
    return output
    
 




@app.route('/upload_image', methods=['POST'])
def upload_image():
    print("API is working!")
    img_object = request.files['image']
    R, G, B = convert_image_to_np(img_object)
    gaussian_blurred_r = gaussian_blur(R, 21)
    gaussian_blurred_g = gaussian_blur(G, 21)
    gaussian_blurred_b = gaussian_blur(B, 21)
    # Apply identity kernel
    identity_r = sharpen_kernel(R)
    identity_g = sharpen_kernel(G)
    identity_b = sharpen_kernel(B)

    img_to_show = np.stack([identity_r, identity_g, identity_b], axis=-1)

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