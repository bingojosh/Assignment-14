# CBC News Scraper
## With notes!

In this simple web app, a user can interact with a MongoDB database using cheerio to scrape web pages. The two buttons on the main page header allow the user to either populate the databse or empty it. The articles are scraped from cbc.ca/news and the title, summary, thumbnail image, and a link to the full article are stored in the database. Up to 5 articles are displayed at a time and the user can preview them, click through to the main article which opens in a new tab, or "save" the article for later use. 

Saved articles are removed from the main page and can be accessed by clicking the "saved" button in the navbar. There is no limit to the number of articles that can be saved. Saved articles have an added functionality of being able to add a "note" to that article for later viewing. The saved articles and their notes can be viewed by any user. Only one note at a time can be added to an article, adding a new one with replace the old one. Notes can also be deleted without needing to be replaced. 
