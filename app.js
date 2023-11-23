const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routers/postsRouter");

const app = express();
let port = +process.env.PORT || 3001;

dotenv.config();

app.use(express.json());

app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running on http:/localhost:${port}`);
});
