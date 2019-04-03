//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

const db = require('./models')

mongoose.connect("mongodb://localhost/assignment14db", { useNewUrlParser: true });



app.get("/", function(req, res) {
  res.send("Hello world");
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

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
