const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.set("view engine", "ejs");

const contentPage = require("./routes/contentPage");
const kitchenWardrobePage = require("./routes/kitchenWardrobePage");
const blogList = require("./routes/blogList");
const blogPost = require("./routes/blogPost");

const manageKWContent = require("./routes/manageKWContent");
const editKWContent = require("./routes/editKWContent");
const adminLogin = require("./routes/adminLogin");
const adminHome = require("./routes/adminHome");
const editBlog = require("./routes/editBlog");
const loggedOut = require("./routes/loggedOut");
const logOut = require("./routes/logOut");

const postMailForm = require("./routes/postMailForm");
const postKWContent = require("./routes/postKWContent");
const postKWThumb = require("./routes/postKWThumb");
const postKWContImg = require("./routes/postKWContImg");
const postDelKW = require("./routes/postDelKW");
const postBlog = require("./routes/postBlog");
const postBlogImg = require("./routes/postBlogImg");
const postDelBlog = require("./routes/postDelBlog");
const postLoginInfo = require("./routes/postLoginInfo");



app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({extended: true}));

app.get("/api", (req, res) => { res.send("radiance backend api"); });
app.get("/api/ehe", (req, res) => { res.send("ehe te nandayo"); });

app.use("/api", express.static("public"));

app.use("/api", require("./routes/test"));

app.use("/api", contentPage);
app.use("/api", kitchenWardrobePage);
app.use("/api", blogList);
app.use("/api", blogPost);

app.use("/api", manageKWContent);
app.use("/api", editKWContent);
app.use("/api", adminLogin);
app.use("/api", adminHome);
app.use("/api", editBlog);
app.use("/api", loggedOut);
app.use("/api", logOut);

app.use("/api", postMailForm);
app.use("/api", postKWContent);
app.use("/api", postKWThumb);
app.use("/api", postKWContImg);
app.use("/api", postDelKW);
app.use("/api", postBlog);
app.use("/api", postBlogImg);
app.use("/api", postDelBlog);
app.use("/api", postLoginInfo);

app.listen(3000, (err) => {
	if (err) { console.log(err); }
	else { console.log("app is running on localhost:3000"); }
});

module.exports = app;
