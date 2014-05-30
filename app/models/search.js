var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SiteSearchSchema   = new Schema({
	user: String,
	dateCreated: Date,
	site: String,
	searchTerm: String
});

module.exports = mongoose.model('Search', SiteSearchSchema);