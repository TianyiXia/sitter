const fs = require('fs');
const path = require('path');

const filesToCheck = [
  {
    path: '../src/components/SettingsForm.tsx',
    checks: [
      'fetchSettings',
      'handleSave',
      'handleDragStart', 
      'handleDrop',
      'handleUpload',
      'removePhoto'
    ]
  },
  {
    path: '../src/app/page.tsx',
    checks: [
      'import { useEffect, useState } from "react"',
      'import Image from "next/image"',
      'import { Dog',
      'import { supabase }',
      'type Settings =',
      'export default function Home()'
    ]
  }
];

let failed = false;

filesToCheck.forEach(file => {
  try {
    const filePath = path.join(__dirname, file.path);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Checking ${file.path}...`);
    
    const missing = file.checks.filter(check => !content.includes(check));
    
    if (missing.length > 0) {
      console.error(`FAILED: ${file.path} is missing:`);
      missing.forEach(m => console.error(`- ${m}`));
      failed = true;
    } else {
      console.log(`PASSED: ${file.path}`);
    }
  } catch (err) {
    console.error(`Error reading ${file.path}:`, err.message);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log('All integrity checks passed.');
}