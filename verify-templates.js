import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the templates directory
const templatesDir = path.join(__dirname, 'templates');

// Function to verify heading blocks have level property
function verifyHeadingBlocks(data, templateName) {
    const results = {
        success: true,
        message: `Template ${templateName} is valid.`,
        errors: []
    };

    // Function to recursively check objects for heading blocks
    function checkForHeadingBlocks(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;
        
        // Check if this is a heading block
        if (obj.type === 'heading') {
            if (obj.level === undefined) {
                results.success = false;
                results.errors.push(`Missing 'level' property in heading block at ${path}`);
            }
        }
        
        // Recursively check all properties
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
                // Check array items
                value.forEach((item, index) => {
                    checkForHeadingBlocks(item, `${path}/${key}[${index}]`);
                });
            } else if (typeof value === 'object' && value !== null) {
                // Check nested object
                checkForHeadingBlocks(value, `${path}/${key}`);
            }
        }
    }

    try {
        // Start checking from the root
        checkForHeadingBlocks(data, 'root');
        
        if (!results.success) {
            results.message = `Template ${templateName} has errors.`;
        }
        
        return results;
    } catch (error) {
        return {
            success: false,
            message: `Error analyzing template ${templateName}`,
            errors: [error.message]
        };
    }
}

// Function to load and test a template
function testTemplate(templateFile) {
    try {
        const filePath = path.join(templatesDir, templateFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return verifyHeadingBlocks(data, templateFile);
    } catch (error) {
        return {
            success: false,
            message: `Error loading template ${templateFile}`,
            errors: [error.toString()]
        };
    }
}

// Get all template files
const templateFiles = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.json'));

console.log(`Found ${templateFiles.length} templates to verify\n`);

let allValid = true;

// Test each template
templateFiles.forEach(file => {
    console.log(`Testing template: ${file}...`);
    const result = testTemplate(file);
    
    if (result.success) {
        console.log(`✅ ${result.message}\n`);
    } else {
        allValid = false;
        console.log(`❌ ${result.message}`);
        result.errors.forEach(err => {
            console.log(`  • ${err}`);
        });
        console.log('');
    }
});

if (allValid) {
    console.log("All templates have been verified successfully! 🎉");
    process.exit(0);
} else {
    console.log("Some templates have errors. Please fix them before continuing.");
    process.exit(1);
}
