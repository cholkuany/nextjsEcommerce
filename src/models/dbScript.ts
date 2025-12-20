const fs = require("fs");
const mysql = require("mysql2/promise");

async function exportDataToJsonFile(data: any[] = []) {
  try {
    // Convert data to JSON
    const json = JSON.stringify(data, null, 2);

    // Write to file
    fs.writeFileSync("outdata.json", json);

    console.log("Data written to output.json");
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await fs.end();
  }
}

exportDataToJsonFile();
