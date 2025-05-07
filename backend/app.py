from flask import Flask, request, send_file, Response
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import base64
import time

app = Flask(__name__)
from flask import Flask, request, send_file, Response
from flask_cors import CORS
from PIL import Image
# other imports...

app = Flask(__name__)
# Update your CORS configuration to allow requests from your Vercel domain
CORS(app, resources={r"/*": {"origins": [
    "https://image-convolution-frontend-6kwx3i9hz-elperez750s-projects.vercel.app",
    "http://localhost:3000"  # For local development
]}})

# Rest of your Flask app...

# ===== IMAGE CONVERSION/UTILITY FUNCTIONS =====

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

def img_to_base64(img_array):
    if img_array.dtype != np.uint8:
        img_array = np.clip(img_array, 0, 255).astype(np.uint8)

    img_pil = Image.fromarray(img_array)
    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)
    
    # Encode as base64
    img_bytes = buffer.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    
    # Return as data URI for HTML embedding
    return f"data:image/png;base64,{img_base64}"

# ===== IMAGE FILTER/EFFECT FUNCTIONS =====

def invert_image(image):
    inverted = 255 - image
    return inverted

def gaussian_blur(image, kernel_size):
    Y, X = np.meshgrid(np.linspace(-3, 3, kernel_size), np.linspace(-3, 3, kernel_size))
    kernel = np.exp(-(X**2 + Y**2) / kernel_size)

    # Normalize the kernel
    kernel /= np.sum(kernel)

    half_kernel = kernel_size // 2

    padded_image = np.pad(image, pad_width=half_kernel)

    conv_output = np.zeros_like(image)
    rows = image.shape[0]
    cols = image.shape[1]

    for i in range(rows):
        for j in range(cols):
            # Perform convolution
            piece = padded_image[
                i : i + kernel_size,
                j : j + kernel_size,
            ]

            total = np.sum(kernel * piece)
            conv_output[i, j] = total

    return conv_output

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

def laplacian_filter(img_array):
    laplacian_kernel = np.array([
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ])

    kernel_size = laplacian_kernel.shape[0]
    half_kernel = laplacian_kernel.shape[0] // 2
   
    padded_image = np.pad(img_array, pad_width=half_kernel)
    output = np.zeros_like(img_array)

    rows = img_array.shape[0]
    cols = img_array.shape[1]
    for r in range(rows):
        for c in range(cols):
            piece = padded_image[r: r + kernel_size, c:c+ kernel_size]
            convolution = np.sum(piece * laplacian_kernel)
            output[r][c] = convolution

    return output

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

# ===== ROUTE HANDLERS - COLOR CHANNEL FILTERS =====

@app.route("/red_channel", methods=["POST"])
def upload_red_channel():
    img_object = request.files['image']
    R, G, B = convert_image_to_np_color(img_object)
    G[:,:] = 0
    B[:, :] = 0
  
    img_to_show = np.stack([R, G, B], axis=-1)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

    img_pil = Image.fromarray(img_to_show)
    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

@app.route("/green_channel", methods=["POST"])
def upload_green_channel():
    img_object = request.files['image']
    R, G, B = convert_image_to_np_color(img_object)
    R[:, :] = 0
    B[:, :] = 0
    
    img_to_show = np.stack([R, G, B], axis=-1)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

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
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

    img_pil = Image.fromarray(img_to_show)
    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

# ===== ROUTE HANDLERS - TRANSFORMATION FILTERS =====

@app.route("/black_and_white_image", methods=["POST"])
def upload_black_and_white():
    print("API is working")
   
    img_object = request.files["image"]
    threshold_value = request.values["threshold_value"]
    img_array = convert_image_to_np(img_object)

    img_to_show = black_and_white(img_array, threshold_value)
    if img_to_show.max() <= 1.0:
        img_to_show = (img_to_show * 255).astype(np.uint8)
    else:
        img_to_show = np.clip(img_to_show, 0, 255).astype(np.uint8)

    img_pil = Image.fromarray(img_to_show)
    buffer = io.BytesIO()
    img_pil.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

# ===== ROUTE HANDLERS - STREAMING FILTERS =====


@app.route("/gaussian_blur", methods=["POST"])
def upload_gaussian_blur():
    print("Hitting progressive blur")
    img_file = request.files['image']
    R, G, B = convert_image_to_np_color(img_file)

    def gaussian_stream():
        height = R.shape[0]
        step = height // 5
        overlap = 25
        blurred_r = R.copy()
        blurred_g = G.copy()
        blurred_b = B.copy()

        for y in range(0, height, step):
            start = max(0, y - overlap)
            end_y = min(y + step + overlap, height)

            section_r = gaussian_blur(R[start:end_y], 18)
            section_g = gaussian_blur(G[start:end_y], 18)
            section_b = gaussian_blur(B[start:end_y], 18)

            # Compute where to write in the original image
            write_start = y
            write_end = min(y + step, height)

            # Corresponding slice in the blurred section (offset by start)
            section_start = write_start - start
            section_end = section_start + (write_end - write_start)

            # Safely write only non-overlapping center part
            blurred_r[write_start:write_end] = section_r[section_start:section_end]
            blurred_g[write_start:write_end] = section_g[section_start:section_end]
            blurred_b[write_start:write_end] = section_b[section_start:section_end]

            frame = np.stack([blurred_r, blurred_g, blurred_b], axis=-1)
            img_b64 = img_to_base64(frame)
            yield f"data: {img_b64}\n\n"
            time.sleep(0.05)
            
        yield "data: DONE\n\n"
        
    return Response(gaussian_stream(), mimetype="text/event-stream")

@app.route("/sharpen_image", methods=["POST"])
def upload_sharpen_image():
    print("Hitting sharpen image ")
    img_file = request.files['image']
    R, G, B = convert_image_to_np_color(img_file)

    def sharpen_stream():
        height = R.shape[0]
        step = height // 5
        overlap = 25
        sharpen_r = R.copy()
        sharpen_g = G.copy()
        sharpen_b = B.copy()
        
        for y in range(0, height, step):
            start = max(0, y - overlap)
            end_y = min(y + step + overlap, height)

            section_r = sharpen_kernel(R[start:end_y])
            section_g = sharpen_kernel(G[start:end_y])
            section_b = sharpen_kernel(B[start:end_y])

            # Compute where to write in the original image
            write_start = y
            write_end = min(y + step, height)

            # Corresponding slice in the blurred section (offset by start)
            section_start = write_start - start
            section_end = section_start + (write_end - write_start)

            # Safely write only non-overlapping center part
            sharpen_r[write_start:write_end] = section_r[section_start:section_end]
            sharpen_g[write_start:write_end] = section_g[section_start:section_end]
            sharpen_b[write_start:write_end] = section_b[section_start:section_end]

            frame = np.stack([sharpen_r, sharpen_g, sharpen_b], axis=-1)
            img_b64 = img_to_base64(frame)
            yield f"data: {img_b64}\n\n"
            time.sleep(0.05)
            
        yield "data: DONE\n\n"
        
    return Response(sharpen_stream(), mimetype="text/event-stream")


@app.route('/invert_image', methods=["POST"])
def upload_invert_image():
    print("Hitting invert")
    img_file = request.files["image"]
    R, G, B = convert_image_to_np_color(img_file)


    def invert_stream():
        height = R.shape[0]
        step = height // 5
        overlap = 25
        invert_r = R.copy()
        invert_g = G.copy()
        invert_b = B.copy()
        
        for y in range(0, height, step):
            start = max(0, y - overlap)
            end_y = min(y + step + overlap, height)

            
        

            section_r = invert_image(R[start:end_y])
            section_g = invert_image(G[start:end_y])
            section_b = invert_image(B[start:end_y])

            # Compute where to write in the original image
            write_start = y
            write_end = min(y + step, height)

            # Corresponding slice in the blurred section (offset by start)
            section_start = write_start - start
            section_end = section_start + (write_end - write_start)

            # Safely write only non-overlapping center part
            invert_r[write_start:write_end] = section_r[section_start:section_end]
            invert_g[write_start:write_end] = section_g[section_start:section_end]
            invert_b[write_start:write_end] = section_b[section_start:section_end]

            frame = np.stack([invert_r, invert_g, invert_b], axis=-1)
            img_b64 = img_to_base64(frame)
            yield f"data: {img_b64}\n\n"
            time.sleep(0.05)
            
        yield "data: DONE\n\n"
        
    return Response(invert_stream(), mimetype="text/event-stream")






@app.route('/laplacian_image', methods=["POST"])
def upload_laplacian_image():
    print("Hitting laplacian image")
    img_file = request.files['image']
    R, G, B = convert_image_to_np_color(img_file)

    def laplacian_stream():
        height = R.shape[0]
        step = height // 5
        overlap = 25
        laplacian_r = R.copy()
        laplacian_g = G.copy()
        laplacian_b = B.copy()

        for y in range(0, height, step):
            start = max(0, y - overlap)
            end_y = min(y + step + overlap, height)

            section_r = laplacian_filter(R[start:end_y])
            section_g = laplacian_filter(G[start:end_y])
            section_b = laplacian_filter(B[start:end_y])

            # Compute where to write in the original image
            write_start = y
            write_end = min(y + step, height)

            # Corresponding slice in the blurred section (offset by start)
            section_start = write_start - start
            section_end = section_start + (write_end - write_start)

            # Safely write only non-overlapping center part
            laplacian_r[write_start:write_end] = section_r[section_start:section_end]
            laplacian_g[write_start:write_end] = section_g[section_start:section_end]
            laplacian_b[write_start:write_end] = section_b[section_start:section_end]

            frame = np.stack([laplacian_r, laplacian_g, laplacian_b], axis=-1)
            img_b64 = img_to_base64(frame)
            yield f"data: {img_b64}\n\n"
            time.sleep(0.05)
            
        yield "data: DONE\n\n"
        
    return Response(laplacian_stream(), mimetype="text/event-stream")