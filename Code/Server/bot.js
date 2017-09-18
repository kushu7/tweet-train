var twit = require('twit');
var keys = require('./keys'); //Configuration keys
var express = require('express');
var fs = require('fs');
var url = require('url');
var app = express();
var T = new twit(keys);
var searchQuery = '#paytm'; //query for searching tweets
var cunt = 1;
var query = {q : searchQuery, count: cunt};

app.get('/search',function(req,res)
{
	var query = url.parse(req.url,true).query;
	searchQuery =query.id;
	if(query.count !== undefined)
	cunt = query.count;
	console.log('query:' + searchQuery + ', count:' + cunt);
	query = {q : searchQuery, count: cunt};
	getTweets(query,cunt,res);
	
	console.log(new Date().toLocaleString() + ': Done ');
});
//Server
var server = app.listen(3000,'0.0.0.0',function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on ' + host + ":" + port);
});
var status = {status: 'byebye'};






//For searching Tweet with query
function getTweets(query,cunt,res)
{
	var obj="";
	T.get('search/tweets',query, function(err, data, response) {
		if(err){
			savelog(err,'getTweets');
			res.end('Something went Wrong');
		}
		else{
		for(var i =0;i<data.statuses.length;i++)
		{
		obj += data.statuses[i].text +'<br><br>';
		}
		res.send(obj);
		res.end('Executed');
		
	}
	});
	
}

//For Posting Client Tweet
function tweetIt()
{
		T.post('statuses/update', status,
		function(err, data, response){
		  if(err)savelog(err,'tweetIt');
		  var PostId = data.id;
		console.log('Posted' + 'Post id:' + PostId);
	});
}

//Saving logs 
function savelog(err,method)
{
	var time = new Date().toLocaleString();
	fs.appendFileSync('logs.txt', time + ': Method= ' + method+ 'Error= ' + err,
	function(err)
	{
		if(err){}
		console.log('log saved');
	});

}

