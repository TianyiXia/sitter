const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/SettingsForm.tsx');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const requiredFunctions = [
    'fetchSettings',
    'handleSave',
    'handleDragStart',
    'handleDragOver',
    'handleDrop',
    'handleUpload',
    'removePhoto',
    'addHoliday',
    'removeHoliday',
    'addRequirement',
    'removeRequirement'
  ];

  const missingFunctions = requiredFunctions.filter(func => !content.includes(`const ${func} =`));

  if (missingFunctions.length > 0) {
    console.error('Integrity Test Failed: The following functions are missing in SettingsForm.tsx:');
    missingFunctions.forEach(func => console.error(`- ${func}`));
    process.exit(1);
  } else {
    console.log('Integrity Test Passed: All required functions are present.');
  }
} catch (err) {
  console.error('Error reading file:', err);
  process.exit(1);
}
