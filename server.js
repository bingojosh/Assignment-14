//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

app.use(express.static("public"));

// parse application body as json
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//handlebars boiler plate
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// attach the models for the mongodb
const db = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/assignment14db"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function(req, res) {
  // res.json("Hello world!")
  db.Article.find({ saved: false }, function(error, found) {
    // console.log("goodbye")
    const hbsObject = {
      Article: found.reverse().splice(found.length - 5)
    }
    if (error) {
      console.log(error);
      res.json("Error")
    }
    else {
      res.render("index", hbsObject);
    }
  });
});

app.get("/saved", function(req, res) {

  db.Article.find({ saved: true }, function(err, found) {

    const hbsObject = {
      Article: found
    }
    console.log(found)
    
    if(err) {
      console.log(error);
      res.json("Error")
    }
    else if (found) {
      res.render("saved", hbsObject);
    }

  })
})

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
          // else {
          //   console.log(inserted);
          // }
        });
      }
    });
  }).then(function() {
    res.redirect("/");
  })
});

app.put("/api/:article/save", function(req, res) {
  console.log(req.params.article)
  db.Article.findOneAndUpdate(
    { "_id": req.params.article },
    { "saved": true },
    { new: true }
  ).then(function(edited){
    res.sendStatus(200)
    console.log(edited)
  })
})

app.get("/api/notes/:id", function (req, res) {

  db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
})

app.post("/api/notes/:id", function(req, res) {
  console.log(req.body)
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(result) {
      console.log(result)
      res.sendStatus(200);
    }).catch(function(err){
      console.log("err" +  err)
    })
});

app.post("/delete/article/:id", function(req,res) {
  db.Article.deleteOne({ "_id": req.params.id}).then(
    function(){
      res.sendStatus(200)
    }
  )
})

app.post("/deleteall", function(req, res) {
    db.Article.deleteMany({}).then(
      function(){
        res.sendStatus(200);
      }
    )

});

// var PORT = process.env.PORT || 3000
app.listen(3000, function() {
  console.log("App running on port " + 3000);
});
