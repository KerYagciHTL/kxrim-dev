# Proxmox Deployment Guide

This guide explains how to deploy this portfolio website on the Proxmox server (10.9.14.x).

## Quick Start

On the Proxmox server, run:

```bash
# Clone the proxmox branch
git clone -b proxmox https://github.com/KerYagciHTL/kxrim-dev.git
cd kxrim-dev

# Install dependencies
npm install

# Build for Proxmox (ROOT deployment - default)
npm run build:proxmox

# The dist folder is now ready for deployment
```

## Configuration

The `proxmox` branch has TWO build configurations:

### 1. Root Deployment (DEFAULT - RECOMMENDED)
- **File**: `vite.config.proxmox-root.ts`
- **Command**: `npm run build:proxmox`
- **Setting**: `base: '/'`
- **Access**: `http://10.9.14.x/`
- Use this if deploying to the root of the web server

### 2. Subdirectory Deployment (OPTIONAL)
- **File**: `vite.config.proxmox.ts`
- **Command**: `npm run build:proxmox-subdir`
- **Setting**: `base: '/kxrim/'`
- **Access**: `http://10.9.14.x/kxrim/`
- Use this if deploying to a subdirectory

### 2. Build Script
- **Command**: `npm run build:proxmox`
- Uses the Proxmox-specific Vite configuration
- Outputs to `dist/` folder

### 3. Router Configuration
- **File**: `src/App.tsx`
- Automatically uses the correct basename from Vite config
- No manual changes needed

## Deployment Steps

### Method 1: Manual Copy (RECOMMENDED)
After building, copy the `dist` folder contents to the web server root:

```bash
# On Proxmox server - for ROOT deployment
sudo cp -r dist/* /var/www/html/

# OR for subdirectory deployment (if using build:proxmox-subdir)
sudo mkdir -p /var/www/html/kxrim
sudo cp -r dist/* /var/www/html/kxrim/
```

### Method 2: Using rsync (from local machine)
```bash
# Build locally
npm run build:proxmox

# Deploy to Proxmox ROOT
rsync -avz --delete dist/ user@10.9.14.x:/var/www/html/

# OR deploy to subdirectory
rsync -avz --delete dist/ user@10.9.14.x:/var/www/html/kxrim/
```

## Web Server Configuration

### Apache (.htaccess in /var/www/html/)
For ROOT deployment:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

For subdirectory deployment (.htaccess in /var/www/html/kxrim/):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /kxrim/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /kxrim/index.html [L]
</IfModule>
```

### Nginx (in server block)
For ROOT deployment:
```nginx
location / {
    root /var/www/html;
    try_files $uri $uri/ /index.html;
}
```

For subdirectory deployment:
```nginx
location /kxrim/ {
    alias /var/www/html/kxrim/;
    try_files $uri $uri/ /kxrim/index.html;
}
```

## Accessing the Site

After deployment:
- **ROOT deployment**: `http://10.9.14.x/`
- **Subdirectory deployment**: `http://10.9.14.x/kxrim/`

## Customizing the Base Path

The default build (`npm run build:proxmox`) uses ROOT path (`/`).

If you need subdirectory deployment:
1. Use `npm run build:proxmox-subdir` instead
2. Deploys with `/kxrim/` base path

To change the subdirectory name:
1. Edit `vite.config.proxmox.ts`:
   ```typescript
   base: '/your-new-path/',
   ```
2. Rebuild with `npm run build:proxmox-subdir`
3. Update web server configuration to match

## Preview Locally

To test the Proxmox build locally before deployment:

```bash
# For ROOT deployment
npm run build:proxmox
npm run preview:proxmox

# For subdirectory deployment
npm run build:proxmox-subdir
npm run preview
```

## Differences from Main Branch

- **Main branch**: Deployed at root (`/`) for https://kxrim.is-a.dev/
- **Proxmox branch**: Flexible deployment - root or subdirectory for http://10.9.14.x/

The main branch and production site remain unchanged.

## Troubleshooting

### Assets not loading (404 errors)
- Verify the base path in `vite.config.proxmox.ts` matches the web server directory
- Check that the web server is serving from the correct path
- Ensure the `.htaccess` or nginx config is properly configured

### Routing not working (blank page on refresh)
- The web server must be configured to redirect all requests to `index.html`
- See the Web Server Configuration section above

### API calls failing
- The GitHub API calls should work from any location
- If the Proxmox server has restricted internet access, the repos fallback will be used

## Support

For issues specific to the Proxmox deployment, check:
1. Base path configuration in `vite.config.proxmox.ts`
2. Web server configuration (Apache/Nginx)
3. File permissions on the Proxmox server
