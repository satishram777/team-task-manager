const { execSync } = require('child_process');
const path = require('path');

// Build frontend for production
console.log('Building frontend...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Update package.json start to serve built frontend (in full deploy, use nginx/static)
console.log('Project complete!');

