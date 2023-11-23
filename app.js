const express = require("express");
const dotenv = require("dotenv");

const app = express();
let port = +process.env.PORT || 3001;

dotenv.config();

app.listen(port, () => {
  console.log(`Server is running on http:/localhost:${port}`);
});
