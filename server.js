/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Ken Hardesty
 * Email: 
 */

var path = require('path')
var express = require('express')

var app = express()
var port = process.env.PORT || 3000

// Static elements directory
app.use(express.static('static'))

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars'); // Import express-handlebars
app.engine('handlebars', engine());  // Create an instance of the handlebars engine to process templates
app.set('view engine', 'handlebars'); // Tell express to use the handlebars engine whenever it encounters a *.handlebars file.

app.get('/', function (req, res) {
    res.render('index');
})

app.get('*', function (req, res) {
    res.status(404).render('404');
})

app.listen(port, function () {
    console.log("== Server is listening on port", port);
})
