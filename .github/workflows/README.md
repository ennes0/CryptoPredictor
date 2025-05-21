# GitHub Pages Deployment

This directory contains the GitHub Actions workflow to automatically deploy the CryptoPredict app to GitHub Pages.

## How it works

The `deploy.yml` workflow:

1. Triggers when you push to the main branch
2. Sets up Node.js
3. Installs dependencies
4. Builds the React application
5. Deploys the built files to the gh-pages branch

GitHub Pages will then serve the content from this branch.
