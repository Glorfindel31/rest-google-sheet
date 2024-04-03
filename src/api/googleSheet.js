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
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXoLQzAObWNs4v\ncmaelMYNgesdLAe6IYvXd7PNC9L3o5DTr3wlCQvtWPzdR5AJlorleoZLRcvWwS0W\nQZ/zZXV6fOjsltTGylDgugSzJWw7liJtY6bYkfSluKb1BClYN+9iEOkNI+8FAtFZ\namLRKpwmQI0H/71vfamMmWnuteBXlqea0sTzzVLRdqBknJS6e3e233pjkg5Vh4yQ\nfh9V1+0ux+v34QLcjaIqQhMVrYDDhRiSTZmKz1HGmXAIsAlS41YenDGSBkOnpIg8\ngTyyM0pd44LDJyCzfpz0CJxHzsmL/h/bsq0+OIVvjmnU2jY8J0o0JvEpsbDx64RF\n2XvGaYGfAgMBAAECggEARE8PNwcmmZ8UE3jY5Iz57waEzqGHsyH0dKZhqegAhd3l\nwAHcQLlMc3zY4lrM2RS9XLRDfe4XBKn+2AmjG868+DhA685eirlGBOM5IO2Oi5Pk\nxSWoEfyu9Z75GS6f0Ggr6DO2OKj1C+/YFUz8EApBHGcfpnSQdRTolPd21R39+5DU\nG9lLCmuATrEIbFr6dCShPF8JzwDFJL/2tKVGkFRAQ2E5j+4F/5K8B3uHisVy22TL\nh4fdq46w/Dc6TSZ7//yGJBQSS+oGwyaRLxvh2Ppd9mcSNPLGV3ySzXOp+E8Tpy0A\nnVo9aEbTMQ8trmdRC0ExzKhCrwh0Kb79a03/KaWdCQKBgQDsPcYnVvuX48Nei4Oq\nnh5hvRIif89owO4PC6FToEwjV7iLoPioi/c/UDa5GQyfDVn1ZiSrG2c91LqC97G5\nU2CPtLalseQaU+ERhhHR/BXOuxKVNLcnOMm23eh09NKkvQrD9RJcfh3jtHvLt7K/\n4xF3pWTyEwceiDkg1cOpgEQPJwKBgQDpqZFH8ynF/7q6ZH0lO+9TxrzymzgMzIkf\nQcwKynFAhQmhipVxe45xq5tdjxi5/zgBVvdwvSVgHiJ9qveaU6j/gkPrZnOx3fKT\nEhZOA4rAJBnmCmvEKLD2NuT0rUlxuq1l8iUM278FyDAVqD+heRxejD3bwgvjWqVC\ns+3EH3sEyQKBgQDCeiwo8ItXw9FugI2YpGhAb8SBEBRvmPug+SMK09g59BnhIFfz\ncJ3Oyjryb7ObMAORaE/haEK6fOg5rqzo8sF4K/18NBCit9B9e5Ap/Er7j7dBi08H\ng9FSsCWQOoc5xMIbBSHjcJMsg8SxtPz6yHP1uft66L0gnmXhKPjVDdl5WwKBgQDK\nTEi/5kLwbauY3I+MwQs/mPzVfpVUX3EIYsrpPMQ4e/YOqhEgozx8JXrp0Y4y2kf+\nwPCR5vCI+w4Zhv+/2VajgICVOapJAEOYGTy+Zkqmd5sEk1kiB6jOQlCPlcfUcy7U\n6IQzUb1coCkhVv1gK57oLLsRnDr2p/AUg/sCpc64IQKBgQCNSLboNp/9aIKE7/PW\nqHHnkrLA699nd1IDfeEXHigHCBC9FwmIryUd05qpd3gZlDyY/N+kH8lA+Il6nOE7\nYGvcIWDTS2MCmYVDLzK+LBKFpVlAmtxYgdEw/lByatkFPCiX8UdOElK83d42lnjK\nzzXlg5HRXjmJhRMKvCa9cSiNgg==\n-----END PRIVATE KEY-----\n",
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
