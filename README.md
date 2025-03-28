# Filmify - Analog Film Emulator

#### Video Demo: https://youtu.be/YRexE5m2JZw

#### Description:
Filmify is a web-based application that transforms digital images into film-like photographs using authentic analog effects. Built with Python/Flask for image processing and React.js for the frontend. This project serves as my final project for CS50's Introduction to Computer Science

# Implementation Details

## Backend Architecture (Python/Flask)
The core image processing pipeline consists of four main stages:

### 1. Color Grading with Hald CLUT  
The process begins by applying color grading using a Hald CLUT (Color Look-Up Table). A Hald CLUT is an image that translates every existing colour in the original image to a new one, for a specific "look". These CLUTs were taken from RawTherapee (see credits below).

The algorithm:

- Randomly selects a Hald CLUT from a collection of film-inspired color grades
- Maps each pixel's RGB values from the input image to corresponding values in the Hald CLUT
- Creates a new image with the transformed colors

### 2. Halation Effect
Halation simulates the light bleeding effect common in film photography, particularly around bright areas. 

The process:

- Creates a mask by identifying bright pixels (A black and white mask, similar to what one would do in Photoshop)
- Applies Gaussian blur to this mask to create a soft glow effect
- Blends this glowing effect back into the image
- Red channel receives the strongest effect, simulating the characteristic red glow of film halation (although I do have to admit the effect is not that apparent)

### 3. Light Leak Simulation
Light leaks simulate the effect of light accidentally entering the camera and creating unique color patterns. In film chameras this is due to analogue imperfections, which add character and interest to a photograph. 

The implementation:

- Randomly selects a light leak overlay from different presets stored in the "Light Leaks Overlays" folder
- Resizes the overlay while maintaining aspect ratio so it covers the image
- Crops and positions to avoid overlays ending before the image does
- Blends the light leak with the image using overlay the blend mode python library


### 4. Film Grain

Film grain adds the characteristic texture of analog film. 

The process (similar to the light leak process):

- Selects a random grain pattern from a collection
- Resizes the grain overlay to match the image dimensions
- Applies the grain using overlay blend mode with controlled opacity (otherwise the image becomes too dark)

## Frontend Architecture (React.js)
The front end is built with React.js using VITE. Tailwind CSS is used for styling.

# File Structure

## Backend
- `Film HaldCLUTs/` - folder with different Hald CLUTS from RawTherapee
- `Grains Overlays/` - folder with grain overlays
- `Light Leaks Overlays/` - folder with light leak overlays
- `requirements.txt` - list of dependencies
- `main.py` - main python file with routing and the image processing pipeline
- `config.py` - Flask app configurations

## Frontend
- `src/` - source code directory
  - `App.css` - styling for the App component
  - `App.jsx` - main React component containing the page layout
  - `ImageUploader.jsx` - component handling image upload and display
  - `main.jsx` - entry point for the React application
- `eslint.config.js` - ESLint configuration for code linting
- `index.html` - root HTML file
- `package-lock.json` - exact dependency tree for npm packages
- `package.json` - project metadata and dependencies
- `README.md` - VITE README file
- `vite.config.js` - configuration for Vite build tool

## Usage Details
1. Clone repository

2. Install backend requirements:

```bash
pip install -r requirements.txt
```

3. Start Flask server:

```bash
flask run --port=5000
```

4. Install frontend dependencies:

```bash
cd frontend && npm install
```

5. Start development server:

```bash
npm run dev
```


## Educational Disclaimer
This project was created exclusively for educational purposes as part of Harvard University's CS50 course requirements. It is not intended for commercial use.

## Third-Party Assets Attribution
- **Hald CLUTs**: From RawTherapee's Film Simulation Collection ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/))
- **Film Grain Textures**: Adapted from Behance pack by RvDxH (Free for personal/educational use)
