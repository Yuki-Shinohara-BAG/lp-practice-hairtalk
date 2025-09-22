# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a static landing page for "HairTalk Translator", a fictional translation service for hair salons. It's a learning project focused on web marketing, using:

- Simple HTML/CSS/JavaScript for the landing page
- Google Apps Script for form processing
- GA4 and GTM for event tracking

The project is intended for educational purposes and deployed on GitHub Pages.

## Development Commands

### Local Development

The recommended way to run the project locally is using VSCode's Live Server extension:

```
1. Install the Live Server extension in VSCode
2. Right-click on index.html and select "Open with Live Server"
3. The page will open in your browser at http://127.0.0.1:5500 (or similar)
```

### Deployment

To deploy to GitHub Pages:

```
1. Push changes to the main branch
2. Ensure GitHub Pages is configured in repository Settings → Pages:
   - Source: Branch: main / root
3. Site will be published at https://yourusername.github.io/hairtalk-landing/
```

## Architecture

The project has a simple structure:

- `index.html`: Main landing page with hero section, description, CTA, and form
- `assets/`
  - `style.css`: CSS styles
  - `main.js`: JavaScript for form handling and GA4 event tracking
- `downloads/`: Contains downloadable content (PDFs)

Form submissions are processed via:
1. Form data collected in `index.html`
2. Sent to Google Apps Script web app via JavaScript fetch
3. Stored in Google Sheets
4. Success/failure response returned to the page

## Google Apps Script Setup

For form processing:
1. Create Google Spreadsheet for storing submissions
2. Set up Apps Script in the spreadsheet to receive form data
3. Deploy as web app with public access
4. Update the script URL in `assets/main.js` (GAS_ENDPOINT variable)

## Analytics Events

The project tracks the following events via GA4/GTM:
- `cta_click`: CTA button clicks
- `form_submit`: Successful form submissions
- `file_download`: PDF downloads