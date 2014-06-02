// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(bodyParser());

//Template engine
app.set('view engine', 'ejs'); 

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/jojo'); // connect to our database
var Search     = require('./app/models/search');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});


// on Routes that end in /Searchs
router.route('/searchs')

	// create a search (accessed at POST http://localhost:8080/Searchs)
	.post(function(req, res) {
		
		var search = new Search();		// create a new instance of the Search model
		search.user = req.body.user;
		search.dateCreated = req.body.dateCreated;
		search.site = req.body.site;
		search.searchTerm = req.body.searchTerm;

		search.save(function(err) {
			if (err)
				res.send(err);
			res.send('200');
			//res.json({ message: 'Search Saved!' });
		});
	})
	// get all the Searches (accessed at GET http://localhost:8080/api/searchs)
	.get(function(req, res) {
		Search.find(function(err, searchs) {
			if (err)
				res.send(err);

			res.json(searchs);
		});
	});

// on routes that end in /search/:user
// ----------------------------------------------------
router.route('/searchs/:user')

	// get the Searchs by the User with that id
	.get(function(req, res) {
			Search.find({ user : req.params.user}, function(err, search) {
			if (err)
				res.send(err);
			res.json(search);
			//alert(res.json(search));
		});
	})


// Out of the API, this is not Good now, but, we show the list of searches by User logged, now hardcoded.
// ----------------------------------------------------
app.get('/profile', function(req, res) {
	Search.find({ user : "rauljuarez@gmail.com"}, function ( err, searchs, count ){ //We Find on the DB and then we render the content
	    res.render( 'lists.ejs', {
		  searchs : searchs,
		  user: "rauljuarez@gmail.com"
	    });
    });
});



// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Working on Port ' + port);
