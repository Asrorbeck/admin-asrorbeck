const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment...');

const buildDir = path.join(__dirname, '..', 'build');
const cnameFile = path.join(buildDir, 'CNAME');

// CNAME faylini yaratish
fs.writeFileSync(cnameFile, 'admin.asrorbeck.uz\n');

try {
  // Git status tekshirish
  console.log('📦 Checking git status...');
  execSync('git status --porcelain', { stdio: 'inherit' });

  // Build papkasida git init
  console.log('📂 Initializing git in build directory...');
  process.chdir(buildDir);
  
  try {
    execSync('git init', { stdio: 'inherit' });
  } catch (e) {
    // Ignore if already initialized
  }

  // Remote qo'shish
  console.log('🔗 Setting up remote...');
  try {
    execSync('git remote remove origin', { stdio: 'ignore' });
  } catch (e) {
    // Ignore if doesn't exist
  }
  execSync('git remote add origin https://github.com/Asrorbeck/admin-asrorbeck.git', { stdio: 'inherit' });

  // Barcha fayllarni add qilish
  console.log('➕ Adding files...');
  execSync('git add -A', { stdio: 'inherit' });

  // Commit qilish
  console.log('💾 Committing changes...');
  try {
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  No changes to commit or commit failed');
  }

  // gh-pages branchga push qilish
  console.log('🌐 Pushing to gh-pages branch...');
  execSync('git push -f origin HEAD:gh-pages', { stdio: 'inherit' });

  console.log('✅ Deployment successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

