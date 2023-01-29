const express = require("express");
const cors = require("cors");

const saveBlog = require("./routes/saveBlog");
const getBlog = require("./routes/getBlog");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => { res.send("app is running"); });
app.use("/", saveBlog);
app.use("/", getBlog);

app.listen(4000, (err) => {
    if (err) { console.log(err); }
    else { console.log("server listening on port 4000"); }
});

module.exports = app;