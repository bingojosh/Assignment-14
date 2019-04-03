//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

app.use(express.static("public"));

// parse application body as json
app.use(express.urlencoded({ extended: true}));
app.use(express.json);

//handlebars boiler plate
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// attach the models for the mongodb
const db = require('./models');

mongoose.connect("mongodb://localhost/assignment14db", { useNewUrlParser: true });

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/all", function(req, res) {

  db.Article.find({}, function(error, found) {

    if (error) {
      console.log(error);
    }

    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {

  axios.get("https://www.cbc.ca/news").then(function(response) {

    var $ = cheerio.load(response.data);
    var arr = []
    // console.log('scraping...')

    $(".card ").each(function(i, element) {
        // console.log(element)
      var title = $(element).find(".headline").text();
    //   console.log("title: " + title)
      var link = $(element).attr("href");
    //   console.log("link:" + link)
      var summary = $(element).find(".description").text();
      var image = $(element).find("img").attr("src")

    
      if (title && link && summary && image) {
    
        db.Article.create({
          title: title,
          link: link,
          summary: summary,
          image: image
        },
        function(err, inserted) {
          if (err) {
        
            console.log(err);
          }
          else {
        
            console.log(inserted);
          }
        });
      }
    });
  });
  res.json("Scrape completed")
});

app.post("/deleteall", function(req, res) {

    db.Article.remove({},
        function(err) {
            if (err) {
                console.log(err)
            } else {
                res.json("Deleted.")
            }
        });
});

var PORT = process.env.PORT || 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
