const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

const exportToCSV = async (data, fileName, header) => {
  const filePath = path.join(__dirname, '../exports', fileName);
  
  // Ensure exports directory exists
  if (!fs.existsSync(path.join(__dirname, '../exports'))) {
    fs.mkdirSync(path.join(__dirname, '../exports'));
  }

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: header,
  });

  await csvWriter.writeRecords(data);
  return filePath;
};

module.exports = { exportToCSV };
