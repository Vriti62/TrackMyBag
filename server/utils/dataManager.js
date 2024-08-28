const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/luggageData.json');

exports.saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

exports.loadData = () => {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
  }
  return [];
};
