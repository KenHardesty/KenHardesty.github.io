/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Ken Hardesty    
 * Email: hardeske@oregonstate.edu
 */

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var postData = require('./postData.json'); // Import your posts data

var app = express();
var port = process.env.PORT || 3000;

// Set Handlebars as the view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'layout', // Use 'layout.handlebars' as the default layout
    layoutsDir: path.join(__dirname, 'templates') // Layout directory
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'templates')); // Templates directory

// Serve static files
app.use(express.static('static'));

// Route for the posts page (root path '/')
app.get('/', function (req, res) {
    res.status(200).render('postsPage', {
        title: 'Posts',
        posts: postData // Pass the array of posts from postData.json
    });
});

// Route for a single post page (e.g., '/posts/0')
app.get('/posts/:id', function (req, res) {
    var postId = parseInt(req.params.id, 10); // Parse the post ID from the URL
    if (postId >= 0 && postId < postData.length) {
        res.status(200).render('postsPage', {
            title: postData[postId].title,
            posts: [postData[postId]] // Pass only the single post as an array
        });
    } else {
        res.status(404).render('404', {
            title: 'Page Not Found'
        });
    }
});

// 404 Route (Handles unmatched routes)
app.get('*', function (req, res) {
    res.status(404).render('404', {
        title: 'Page Not Found'
    });
});

// Start the server
app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
