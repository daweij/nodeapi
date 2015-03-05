var express = require('express'), 
		uuid = require('node-uuid'), 
		http = require('http'), 
		path = require('path'), 
		fs = require('fs'), 
		_ = require('underscore');
		
var app = express();

var data = {
	customers: JSON.parse(fs.readFileSync('data/customers.json', 'utf8')),
	projects: JSON.parse(fs.readFileSync('data/projects.json', 'utf8')),
};


app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/pages');
	app.set('view engine', 'ejs');
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.favicon());
});




// PROJECTS
app.get('/api/projects', function(req, res) {
  res.json(data.projects);
});

app.get('/api/projects/:id', function(req, res) {
  var id = req.params.id;
	var project = _.find(data.projects, function(obj) { 
		return obj.Id === id 
	});
	
	if (project === 'undefined') {
		res.statusCode = 404;
    return res.send('Error 404: Not found');
  }
	
  res.json(project);
});

app.post('/api/projects', function(req, res) {
  if (!req.body.hasOwnProperty('CustomerId') || !req.body.hasOwnProperty('Name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
 
	var project = {
    Id : uuid.v1(),
		CustomerId : req.body.CustomerId,
    Name : req.body.Name
  }; 
 
	projects.push(project);
  res.json(true);
});

// CUSTOMERS
app.get('/api/customers', function(req, res) {
  res.json(data.customers);
});

app.get('/api/customers/:id', function(req, res) {
  var id = req.params.id;
	var customer = _.find(data.customers, function(obj) { 
		return obj.Id === id 
	});
	
	if (customer === 'undefined') {
		res.statusCode = 404;
    return res.send('Error 404: Not found');
  }
	
  res.json(customer);
});

app.post('/api/customers', function(req, res) {
  if (!req.body.hasOwnProperty('Name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
 
	var customer = {
    Id : uuid.v1(),
    Name : req.body.Name
  }; 
 
	customers.push(customer);
  res.json(true);
});




// HTML
app.get('/', function(req, res) {
	res.render('index', {
		projects: data.projects,
		customers: data.customers
	});
});




app.listen(app.get('port'), function(){
	console.log('Woop woop! ' + app.get('port'));
});
