const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const auth = require("./middleware/authorization");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const config = require("./config");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.POSTGRES_URL,
    ssl: false
  }
});

//db.select().from('users').then(data => console.log(data)).catch(error => console.log(error))

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// Endpoints

app.get("/", (req, res) => {
  res.send("Success!");
});

app.post("/signin", signin.signinAuthentication(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.put("/image", auth.requireAuth, image.handleImage(db));

app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.get("/profile/:id", auth.requireAuth, profile.handleProfileGetById(db));

app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
