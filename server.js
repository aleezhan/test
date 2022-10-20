require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

app.use('/upload/images', express.static('upload/images'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "It is a test api." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/file.routes')(app)

const PORT = process.env.APP_PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
