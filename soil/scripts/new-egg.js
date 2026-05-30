#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // run `npm install uuid` if needed

const templatePath = path.join(__dirname, '../templates/eggs/EGG-TEMPLATE.json');
const eggsDir = path.join(__dirname, '../../eggs');

function createEgg(title, type = "seed") {
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  const egg = {
    ...template,
    id: title.toLowerCase().replace(/\s+/g, '-'),
    title: title,
    type: type,
    created: new Date().toISOString().split('T')[0],
    lastModified: new Date().toISOString().split('T')[0]
  };

  const filePath = path.join(eggsDir, `${egg.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(egg, null, 2));
  
  console.log(`✅ New egg created: ${egg.id}`);
  return egg;
}

// Allow running directly: node new-egg.js "My Cool Idea"
if (require.main === module) {
  const title = process.argv[2];
  if (!title) {
    console.log("Usage: node new-egg.js \"Title of the egg\"");
    process.exit(1);
  }
  createEgg(title);
}

module.exports = { createEgg };
