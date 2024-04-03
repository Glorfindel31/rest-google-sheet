const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

function convertToISODate(dateString) {
  const [day, month, year] = dateString.split("/");

  let adjustedYear = parseInt(year, 10);
  if (adjustedYear < 100) {
    adjustedYear += 2000;
  }

  const date = new Date(adjustedYear, month - 1, day);

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
  const adjustedDate = new Date(date.getTime() - timezoneOffset);

  const isoDate = adjustedDate.toISOString();
  return isoDate;
}

function transformData(data) {
  let name = null;

  const colorReplacements = {
    R: "red",
    G: "green",
    BL: "blue",
    Y: "yellow",
    PI: "pink",
    PR: "purple",
    BK: "black",
    O: "orange",
    W: "white",
  };

  const transformedValues = data.values
    .map((row, index) => {
      row[1] === "1" ? (name = row[0]) : (name = name);
      const link = row[7] || "";
      if (!row[2]) return null;
      const color = colorReplacements[row[2]] || row[2];
      return {
        name: name,
        id: row[1],
        color: color,
        grade: row[3],
        setter: row[4].toLowerCase(),
        comment: row[5],
        date: convertToISODate(row[6]),
        link: link,
      };
    })
    .filter((item) => item !== null);

  return {
    transformedValues,
    routeNum: transformedValues.length,
  };
}

const keys = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const spreadSheetId = process.env.SHEET_ID;

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

client.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Authorized successfully");
  }
});

router.get("/", async (req, res) => {
  const gsapi = google.sheets({ version: "v4", auth: client });

  const opt = {
    spreadsheetId: spreadSheetId,
    range: "Sheet1!B3:I137",
  };

  try {
    const data = await gsapi.spreadsheets.values.get(opt);
    const transformedData = transformData(data.data);
    res.json(transformedData);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error reading spreadsheet");
  }
});

module.exports = router;
