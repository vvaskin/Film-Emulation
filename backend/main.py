from flask import request, jsonify, send_file
from config import app

import numpy as np
from PIL import Image, ImageFilter
from tqdm import tqdm
import math
import os
import random
import blend_modes

import io

def get_random_file(path):
    """
    Returns a random filename, chosen among the files of the given path.
    """
    files = os.listdir(path)
    index = random.randrange(0, len(files))
    return files[index]

def apply_3d_clut(clut, img, clut_size):
    """
    clut must have the shape (clut_size, clut_size, clut_size, num_channels=3)
    """
    filtered_img = np.copy(np.asarray(img))
    scale = (clut_size - 1) / 255
    img = np.asarray(img)
    clut_r = np.rint(img[:, :, 0] * scale).astype(int)
    clut_g = np.rint(img[:, :, 1] * scale).astype(int)
    clut_b = np.rint(img[:, :, 2] * scale).astype(int)
    filtered_img = clut[clut_r, clut_g, clut_b]
    filtered_img = Image.fromarray(filtered_img.astype('uint8'), 'RGB')
    return filtered_img

def create_identity(size):
    clut = np.zeros((size, size, size, 3))
    scale = 255 / (size - 1)
    for b in range(size):
        for g in range(size):
            for r in range(size):
                clut[r, g, b, 0] = r * scale
                clut[r, g, b, 1] = g * scale
                clut[r, g, b, 2] = b * scale
    return clut 

def apply_hald_clut(hald_img, img):
    hald_w, hald_h = hald_img.size
    clut_size = int(round(math.pow(hald_w, 1/3)))
    # We square the clut_size because a 12-bit HaldCLUT has the same amount of information as a 144-bit 3D CLUT
    scale = (clut_size * clut_size - 1) / 255
    # Convert the PIL image to numpy array
    img = np.asarray(img)
    # We are reshaping to (144 * 144 * 144, 3) - it helps with indexing
    hald_img = np.asarray(hald_img).reshape(clut_size ** 6, 3)
    # Figure out the 3D CLUT indexes corresponding to the pixels in our image
    clut_r = np.rint(img[:, :, 0] * scale).astype(int)
    clut_g = np.rint(img[:, :, 1] * scale).astype(int)
    clut_b = np.rint(img[:, :, 2] * scale).astype(int)
    filtered_image = np.zeros((img.shape))
    # Convert the 3D CLUT indexes into indexes for our HaldCLUT numpy array and copy over the colors to the new image
    filtered_image[:, :] = hald_img[clut_r + clut_size ** 2 * clut_g + clut_size ** 4 * clut_b]
    filtered_image = Image.fromarray(filtered_image.astype('uint8'), 'RGB')
    return filtered_image

def create_halation_mask(img, threshold=200):
    """
    Creates a mask of bright areas that will glow
    threshold: brightness level (0-255) above which pixels will glow
    """
    # Convert to numpy array
    img_array = np.array(img)
    
    # Create mask of bright areas (focusing on red channel which creates nice halation)
    mask = img_array[:,:,0] > threshold
    
    # Convert back to PIL image
    mask = Image.fromarray((mask * 255).astype(np.uint8))
    return mask

def apply_halation(img, intensity=0.5, threshold=200, blur_radius=15):
    """
    Applies halation effect to an image
    intensity: strength of the effect (0-1)
    threshold: brightness threshold for glow
    blur_radius: size of the glow effect
    """
    # Create mask of bright areas
    mask = create_halation_mask(img, threshold)
    
    # Blur the mask
    blurred_mask = mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    
    # Convert to numpy arrays for calculations
    original = np.array(img).astype(float)
    glow = np.array(blurred_mask).astype(float)
    
    # Add the glow to all channels
    result = original.copy()
    for i in range(3):  # Apply to each RGB channel
        result[:,:,i] += glow * intensity
    
    # Clip values to valid range and convert back to uint8
    result = np.clip(result, 0, 255).astype(np.uint8)
    
    return Image.fromarray(result)

def resize_overlay(image: Image.Image, overlay: Image.Image):
    image_size = image.size # (w, h)

    # Checks if our image is in portrait orientation and rotates the overlay
    '''
    if image_size[0] < image_size[1]:
        overlay = overlay.rotate(90)
    '''
    overlay = overlay.resize(image_size)

    return overlay

def crop_overlay(image: Image.Image, overlay: Image.Image):
    image_size = image.size # (w, h)
    
    # Checks if our image is in portrait orientation and rotates the overlay
    if image_size[0] < image_size[1]:
        overlay = overlay.rotate(90)
    
    overlay_size = overlay.size

    right = overlay_size[0] - random.randint(0, overlay_size[0] - image_size[0])
    left = right - image_size[0]
    bottom = overlay_size[1] - random.randint(0, overlay_size[1] - image_size[1])
    top = bottom - image_size[1]
    
    return overlay.crop((left, top, right, bottom))

def set_opacity(image, value):
    '''
    Converts an RGB image (3 channels) into an RGBA image (4 channels) by adding an alpha channel for opacity.
    '''
    size = image.shape

    if image.shape[2] == 3:
        image = np.dstack((image, np.ones((image.shape[0], image.shape[1])) * 255))  # Add an alpha channel

    size = image.shape
    for i in range(size[0]):
        for j in range(size[1]):
            image[i, j] = (image[i, j][0], image[i, j][1], image[i, j][2], int(value * 255))
    return image

@app.route("/process-image", methods=["POST"])
def process_image():
    # Checks if the file exists
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'})
    
    landscape = Image.open("test-image.jpg")
    

    hald_clut = Image.open(f'Film HaldCLUTs/{get_random_file('Film HaldCLUTs')}')
    applied_clut = apply_hald_clut(hald_clut, landscape)
    print('Applied Hald CLUT to the image')

    # Picking a random light leak overlay
    random_light_leak_file = get_random_file('Light Leaks Overlays/Multi')
    light_leak = Image.open(f"Light Leaks Overlays/Multi/{random_light_leak_file}")
    print('The chosen light leak is: ', random_light_leak_file)
    

    applied_halation = apply_halation(applied_clut, intensity=0.3, threshold=100, blur_radius=100)
    print('Applied halation')
    overlay = resize_overlay(applied_halation, light_leak)

    # Converting Image to NumPy arrays
    applied_halation = np.array(applied_halation).astype(float)
    overlay = np.array(overlay).astype(float)

    applied_halation = set_opacity(applied_halation, 1)
    overlay = set_opacity(overlay, 1)

    # blend_modes.overlay() expects a np.ndarray as input (same with its output), so we convert back to an Image.Image
    applied_overlay = Image.fromarray(blend_modes.overlay(applied_halation, overlay, 0.5).astype('uint8'), mode="RGBA")
    print('Applied light-leak')
    applied_overlay.show()

    # Converting Image to NumPy arrays
    applied_overlay = set_opacity(np.array(applied_overlay).astype(float), 1)
    grain = set_opacity(np.array(grain).astype(float), 1)

    applied_grain = blend_modes.overlay(applied_overlay, grain, 0.5)
    print('Grain applied')

    final_image = Image.fromarray(applied_grain.astype('uint8'), 'RGBA')

    # Convert PIL Image to bytes for sending
    img_buffer = io.BytesIO() # Create temporary memory buffer
    final_image.save(img_buffer, 'PNG') # Save the image to the buffer

    return send_file(img_buffer, mimetype='image/png') # Sends file using flask's send_file function
    
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message":"API is up and running"}), 200

if __name__ == "__main__": # Run if you run the file, ignore if imported
    app.run(debug=True)