# GitHub Pages Deployment Instructions

## Permission Error Fix

If you're encountering a "Permission denied to github-actions[bot]" error during deployment, follow these steps:

1. Go to your repository on GitHub
2. Click on **Settings** > **Actions** > **General** in the left sidebar
3. Scroll down to the **Workflow permissions** section
4. Select **Read and write permissions**
5. Check the box that says **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

![Workflow Permissions](https://docs.github.com/assets/cb-87213/mw-1440/images/help/actions/workflow-permissions.webp)

## Alternative: Using a Personal Access Token (PAT)

If the above solution doesn't work, you can use a Personal Access Token:

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click **Generate new token** > **Generate new token (classic)**
3. Give it a name like "GitHub Pages Deploy"
4. Select **workflow** scope at minimum, or **repo** for full repository access
5. Click **Generate token** and copy the token

Then add the token to your repository:

1. Go to your repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `PAT_GITHUB_TOKEN`
4. Value: paste the token you copied
5. Click **Add secret**

Finally, update the workflow file to use the PAT:

```yaml
- name: Deploy 🚀
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: prediction/build
    branch: gh-pages
    token: ${{ secrets.PAT_GITHUB_TOKEN }}
    clean: true
    commit-message: "Deploy website [skip ci]"
```

## After Successful Deployment

1. Go to your repository **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** branch and **/(root)** folder
4. Click **Save**

Your site will be available at: `https://[your-username].github.io/CryptoPredictor/`
