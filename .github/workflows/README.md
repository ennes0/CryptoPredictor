# GitHub Pages Deployment

This directory contains the GitHub Actions workflow to automatically deploy the CryptoPredict app to GitHub Pages.

## How it works

The `deploy.yml` workflow:

1. Triggers when you push to the main branch
2. Sets up Node.js
3. Installs dependencies
4. Builds the React application
5. Deploys the built files to the gh-pages branch

## Permission Setup

For this workflow to work properly, follow these steps:

1. Go to your GitHub repository **Settings**
2. Click on **Actions** → **General** in the sidebar
3. Scroll down to **Workflow permissions**
4. Select **Read and write permissions**
5. Check **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

This configuration allows the GitHub Actions bot to push to the gh-pages branch.

## Custom Domain Setup (Optional)

If you're using a custom domain:

1. Make sure to add your domain in the CNAME file
2. Configure your domain's DNS settings to point to GitHub Pages
3. In your repository settings, under "Pages", add your custom domain

## Troubleshooting

If you encounter deployment errors:

1. Check the workflow permissions as described above
2. Verify that the branch name and folder paths in `deploy.yml` are correct
3. Ensure package.json has the correct homepage URL
