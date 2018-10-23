import axios from "axios";

export default {
  // Gets all books
  getArticles: function() {
    return axios.get("/api/articles");
  },
  // Gets the book with the given id
  getArticle: function(id) {
    return axios.get("/api/articles/" + id);
  },
  // Deletes the book with the given id
  deleteArticle: function(id) {
    return axios.delete("/api/articles/" + id);
  },
  // Saves a book to the database
  saveArticle: function(articleData) {
    return axios.post("/api/articles", articleData);
  },
  scrapeArticles: function(title, startdate, enddate) {
    return axios.get(
      "https://api.nytimes.com/svc/search/v2/articlesearch.json" + "?&q=" + title + "&begin_date=" + startdate +  "&end_date=" + enddate + "&api-key=fdc37932d4904c4286591eb0e6fd3349"
      //  + "?begin_date=" + startdate +  "?end_date=" + enddate 
      // + "?end_date=" + enddate + "?q=" + title
      );
  } 
};
