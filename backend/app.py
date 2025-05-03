from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
from scipy.signal import convolve2d
import io


app = Flask(__name__)
CORS(app)

def convert_image_to_np(file_object):
    img = Image.open(file_object)
    if hasattr(img, "format") and img.format == "HEIC":
        img = img.convert("RGB")

    img_array = np.array(img)
    return img_array


def convert_image_to_np_color(file_object):

    img = Image.open(file_object)

    if hasattr(img, "format") and img.format == "HEIC":
        img = img.convert("RGB")

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

    for i in range(half_kernel, image.shape[0] - half_kernel):
        for j in range(half_kernel, image.shape[1] - half_kernel):
            # Perform convolution
            piece = padded_image[
                i - half_kernel : i + half_kernel + 1,
                j - half_kernel : j + half_kernel + 1,
            ]
            total = np.sum(kernel * piece)
            conv_output[i - 1, j - 1] = total

    return conv_output

    # output = convolve2d(image, kernel, mode='same')
    # return output


def black_and_white(img_array, threshold):
    if len(img_array.shape) == 3:
        grayscale = (
            0.299 * img_array[:, :, 0]
            + 0.587 * img_array[:, :, 1]
            + 0.114 * img_array[:, :, 2]
        )
    else:
        grayscale = img_array

    threshold = float(threshold)
    binary_image = (grayscale > threshold).astype("uint8") * 255
    return binary_image


def sharpen_kernel(image):
    kernel = np.array([[0, -1, 0], [-1, 9, -1], [0, -1, 0]])

    half_kernel = kernel.shape[0] // 2
    padded_image = np.pad(image, pad_width=1)
    conv_output = np.zeros_like(image)

    for i in range(half_kernel, image.shape[0] - half_kernel):
        for j in range(half_kernel, image.shape[1] - half_kernel):
            # Perform convolution
            piece = padded_image[
                i - half_kernel : i + half_kernel + 1,
                j - half_kernel : j + half_kernel + 1,
            ]
            total = np.sum(kernel * piece)
            conv_output[i - 1, j - 1] = total

    return conv_output

    # output = convolve2d(image, kernel, mode='same')
    # return output


def laplacian_filter(img_array):
    laplacian_kernel = np.array([
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ])

    half_kernel = laplacian_kernel.shape[0] // 2

   

    padded_image = np.pad(img_array, pad_width=1)
    output = np.zeros_like(padded_image)

    img_array_rows = padded_image.shape[0]
    img_array_cols = padded_image.shape[1]
    for r in range(half_kernel, img_array_rows - half_kernel):
        for c in range(half_kernel, img_array_cols - half_kernel):
            piece = padded_image[r-1: r + half_kernel + 1, c-1: c+ half_kernel + 1]
            convolution = np.sum(piece * laplacian_kernel)
            output[r-1][c-1] = convolution

    return output

    

@app.route("/green_channel", methods=["POST"])
def upload_green_channel():
    img_object = request.files['image']
    R, G, B = convert_image_to_np_color(img_object)
    R[:, :] = 0
    B[:, :] = 0

    
    img_to_show = np.stack([R, G, B], axis=-1)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")



@app.route("/blue_channel", methods=["POST"])
def upload_blue_channel():
    img_object = request.files['image']
    R, G, B = convert_image_to_np_color(img_object)
    R[:, :] = 0
    G[:, :] = 0

    
    img_to_show = np.stack([R, G, B], axis=-1)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")



@app.route("/red_channel", methods=["POST"])
def upload_red_channel():
    img_object = request.files['image']
    R, G, B = convert_image_to_np_color(img_object)
    G[:,:] = 0
    B[:, :] = 0
  
    
    img_to_show = np.stack([R, G, B], axis=-1)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

@app.route('/laplacian_image', methods=["POST"])
def upload_laplacian_image():
    print("hitting the laplacian filter")
    img_object = request.files["image"]

    R, G, B = convert_image_to_np_color(img_object)

    laplacian_r = laplacian_filter(R)
    laplacian_g = laplacian_filter(G)
    laplacian_b = laplacian_filter(B)

    img_to_show = np.stack([laplacian_r, laplacian_g, laplacian_b], axis=-1)

    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")




@app.route("/sharpen_image", methods=["POST"])
def upload_sharpen_image():

    print("Hitting the sharpen route")
    img_object = request.files["image"]
    R, G, B = convert_image_to_np_color(img_object)
    sharpen_r = sharpen_kernel(R)
    sharpen_g = sharpen_kernel(G)
    sharpen_b = sharpen_kernel(B)

    img_to_show = np.stack([sharpen_r, sharpen_g, sharpen_b], axis=-1)


    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")


@app.route("/black_and_white_image", methods=["POST"])
def upload_black_and_white():
    print("API is working")
   
    img_object = request.files["image"]
    threshold_value = request.values["threshold_value"]
    img_array = convert_image_to_np(img_object)

    img_to_show = black_and_white(img_array, threshold_value)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
    # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

    # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")


@app.route("/gaussian_blur", methods=["POST"])
def upload_gaussian_blur():
    print("API is working!")
    img_object = request.files["image"]
    R, G, B = convert_image_to_np_color(img_object)
    gaussian_blurred_r = gaussian_blur(R, 21)
    gaussian_blurred_g = gaussian_blur(G, 21)
    gaussian_blurred_b = gaussian_blur(B, 21)
    # Apply identity kernel

    img_to_show = np.stack(
        [gaussian_blurred_r, gaussian_blurred_g, gaussian_blurred_b], axis=-1
    )

    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
        # If it's already large values but not integers, clip and cast
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

        # Now turn into PIL image
    img_pil = Image.fromarray(img_to_show)
    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")
