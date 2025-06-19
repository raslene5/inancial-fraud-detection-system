const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'RecentFraudList.jsx');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  // Replace all instances of euro sign followed by curly brace for amount
  const result = data.replace(/€{parseFloat/g, '{parseFloat');
  
  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Euro signs removed successfully');
  });
});