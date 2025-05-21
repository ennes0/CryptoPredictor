# GitHub Pages Domain Configuration Instructions

## Option 1: Using GitHub Pages Default Domain

Your site will be available at: `https://ennes0.github.io/CryptoPredictor`

This is configured in package.json with:
```json
"homepage": "https://ennes0.github.io/CryptoPredictor"
```

## Option 2: Using a Custom Domain

To use a custom domain (like crypto-predictor.io):

1. Purchase the domain from a domain registrar (like Namecheap, GoDaddy, etc.)

2. Configure DNS settings at your registrar:
   - Add an A record pointing to GitHub Pages IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add a CNAME record pointing to your `username.github.io`

3. In your repository settings:
   - Go to Settings > Pages
   - Under "Custom domain", enter your domain name
   - Check "Enforce HTTPS" once the certificate is ready

4. Update your package.json:
   ```json
   "homepage": "https://your-custom-domain.com"
   ```

5. Make sure a CNAME file exists in the public directory with your domain:
   ```
   your-custom-domain.com
   ```

6. Wait 24-48 hours for DNS propagation and for GitHub to provision an SSL certificate

## Troubleshooting

- If your site shows a 404 error, check your package.json "homepage" value
- If your custom domain isn't working, verify DNS has propagated using `dig` or online DNS checkers
- If your site loads but has broken links/styles, make sure "homepage" is set correctly
