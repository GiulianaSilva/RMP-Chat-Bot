// Quick verification script to test Railway deployment setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Railway deployment setup...\n');

// Check required files
const requiredFiles = [
    'package.json',
    'server/server.js',
    'client/rmp-chat-widget-production.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
        allFilesExist = false;
    }
});

// Check package.json structure
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ package.json is valid JSON`);
    
    if (pkg.scripts && pkg.scripts.start) {
        console.log(`✅ Start script: ${pkg.scripts.start}`);
    } else {
        console.log(`❌ No start script found`);
        allFilesExist = false;
    }
    
    if (pkg.dependencies && pkg.dependencies.express) {
        console.log(`✅ Express dependency found`);
    } else {
        console.log(`❌ Express dependency missing`);
        allFilesExist = false;
    }
    
} catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    allFilesExist = false;
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 Setup looks good! Railway should be able to deploy this.');
    console.log('\nNext steps:');
    console.log('1. Push to GitHub');
    console.log('2. Deploy on Railway');
    console.log('3. Add GEMINI_API_KEY environment variable');
    console.log('4. Test your deployment URL');
} else {
    console.log('❌ Some issues found. Please fix them before deploying.');
}
console.log('='.repeat(50));