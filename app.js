const express = require("express");
const dotenv = require("dotenv");
const path = "path";
const postsRouter = require("./routers/postsRouter");
const routeNotFound = require("./middlewares/routeNotFound");
const errorsHandler = require("./middlewares/errorsHandler");
const app = express();
let port = +process.env.PORT || 3001;

dotenv.config();

app.use(express.json());

app.use("/posts", postsRouter);

app.use(errorsHandler);
app.use(routeNotFound);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
