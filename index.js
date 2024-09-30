import bodyParser from "body-parser";
import express from "express";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method")); // Allows us to use PUT and DELETE in forms

// Global variable to store blog details
let blogData = {
  bname: "",
  btitle: "",
  bblog: "",
  btime: ""
};

// Middleware to add the current date and time to the request body
function addTimestamp(req, res, next) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");
  const formattedTime = currentDate.toLocaleTimeString("en-GB", { hour12: false });

  req.body.timestamp = `${formattedDate} ${formattedTime}`;
  next();
}

// Render Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Render Contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Render About page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/ourblog", (req, res) => {
  res.render("ourblog.ejs", { blogsdata: blogData});
});

// Render Create Blog page
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

// Handle blog submission (POST)
app.post("/submit", addTimestamp, (req, res) => {
  blogData = {
    bname: req.body.name,
    btitle: req.body.title,
    bblog: req.body.blog,
    btime: req.body.timestamp
  };
  res.render("my-blogs.ejs", { blogsdata: blogData });
});

// Render Edit Blog page with current blog data
app.get("/edit", (req, res) => {
  res.render("edit.ejs", { blogsdata: blogData });
});

// Handle blog update (PUT)
app.put("/update", addTimestamp, (req, res) => {
  // Update the blogData with new values from the form
  blogData = {
    bname: req.body.name,
    btitle: req.body.title,
    bblog: req.body.blog,
    btime: req.body.timestamp
  };

  // After updating, render the display page with the updated data
  res.render("display.ejs", { blogsdata: blogData });
});

app.get("/delete", (req, res) => {
  res.render("delete.ejs");
})
app.delete("/delete", (req, res) => {
  // Example logic: Clear the blogData object
  blogData = null;

  // Redirect after deletion
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
