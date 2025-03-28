# Filmify - Analog Film Emulator

#### Video Demo: 

#### Description:
Filmify is a web-based application that transforms digital images into film-like photographs using authentic analog effects. Built with Python/Flask for image processing and React.js for the frontend. This project serves as my final project for CS50's Introduction to Computer Science

## Implementation Details

### Backend Architecture (Python/Flask)
The core image processing pipeline consists of four main stages:

1. **Hald CLUT** - the algorithm randomly chooses a Hald CLUT (A 2D representation of a traditional Colour Look Up Table) and applies it to the image
2. **Halation** - blurs the brightest areas by first creating a boolean mask of bright areas (similar to Photoshop), blurring this mask, and blending this overlay with the image
3. **Light Leaks** - randomly chooses a random light leak overlay from the ones given and applies it using the `blend_modes` library by cropping, scaling and rotating to fill the original image.
4. **Grain** - similar to the previous step, but this time cycles through a set of grain overlays

### Frontend Architecture (React.js)
The front end is built with React.js using VITE. Tailwind CSS is used for styling.
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


## Credits

RawTherapee Film Simulation Collection version 2015-09-20
CC BY-SA 4.0

This archive contains a collection of film simulation profiles in the Hald Color Look-Up Table pattern (Hald CLUT). Unless otherwise noted in the filename, they are all in the sRGB color space, 8-bit per channel, in the PNG image format. Most of them are designed to mimic the results of various film stocks, pushed and pulled in various ways or faded over time.

Use the level 12 pattern Hald_CLUT_Identity_12.tif to create your own profiles, see the RawPedia article to find out how.

Learn more about Hald CLUTs here:
http://rawpedia.rawtherapee.com/Film_Simulation
http://www.quelsolaar.com/technology/clut.html
http://blog.patdavid.net/2013/08/film-emulation-presets-in-gmic-gimp.html
http://blog.patdavid.net/2013/09/film-emulation-presets-in-gmic-gimp.html

Credits:
Pat David - http://rawtherapee.com/forum/memberlist.php?mode=viewprofile&u=5101
Pavlov Dmitry - http://rawtherapee.com/forum/memberlist.php?mode=viewprofile&u=5592
Michael Ezra - http://rawtherapee.com/forum/memberlist.php?mode=viewprofile&u=1442

Disclaimer:
The trademarked names which may appear in the filenames of the Hald CLUT images are there for informational purposes only. They serve only to inform the user which film stock the given Hald CLUT image is designed to approximate. As there is no way to convey this information other than by using the trademarked name, we believe this constitutes fair use. Neither the publisher nor the authors are affiliated with or endorsed by the companies that own the trademarks.
