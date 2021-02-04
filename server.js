require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios')

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req,res){
  console.log(req.body)
    const qParams = {
        params: {
            s: req.body['search'],
            //t: "the matrix",
            apikey: process.env.OMDB_API_KEY
        }
    }
    axios.get('http://www.omdbapi.com', qParams)
        .then(function(response){
            console.log(response.data)
            return response.data.Search
            //res.render('movies/show' {data:response.data.Search})
        })
        .then(function(mData){
            res.render('results', {data:{data:mData, term: req.body['search'], paged: false}})
        })
})

app.get('/search/:term/:page', function(req,res){
  const qParams = {
    params: {
        s: req.params.term,
        page: req.params.page,
        apikey: process.env.OMDB_API_KEY
    }
  }
  axios.get('http://www.omdbapi.com', qParams)
        .then(function(response){
            console.log(response.data)
            return response.data.Search
            //res.render('movies/show' {data:response.data.Search})
        })
        .then(function(mData){
            res.render('results', {data: {data:mData, term: req.params.term, paged: true, page: req.params.page}})
        })
    

})

app.get('/title/:title', function(req,res){
  const qParams = {
    params: {
        t: req.params.title,
        plot:"full",
        apikey: process.env.OMDB_API_KEY
    }
}
axios.get('http://www.omdbapi.com', qParams)
    .then(function(response){
        console.log(response.data)
        return response.data
        //res.render('movies/show' {data:response.data.Search})
    })
    .then(function(mData){
        res.render('detail', {data:[mData]})
    })
})

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
