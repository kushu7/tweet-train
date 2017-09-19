var twit = require('twit');
var keys = require('./keys'); //Configuration keys
var express = require('express');
var fs = require('fs');
var url = require('url');
var path= require('path');
var os = require('os'); 
var Twitter = require('twitter-oauth-agent');
var request = require('request');
var querystring = require('querystring');
var assign = require('object-assign');
var stringify = require('json-stringify');
//**************Usable variables*********************//
var app = express();
//var T = new twit(keys); //Keys of Clients
var searchQuery = '#paytm'; //query for searching tweets
var tweet="";
var status = {status: tweet}; //tweeting
var cunt = 1;
var query = {q : searchQuery, count: cunt};
var call = 'http://127.0.0.1:3000/twitter/callback';
//*************SERVER*********************
var server = app.listen(3000,'0.0.0.0',function(){ //0.0.0.0 Listening to machine address
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on ' + host + ":" + port);
});


 
// Get the token and send to the client 
app.get('/',function(req,res)
{
	console.log('in twiiter oauth');
Twitter(keys, function(err, token) {
  if (err) return res.status(500).send({ error: err.message });
 client_login(token,res);  });
});
//client login
function client_login(token,res)
{
obj = assign(token);
	console.log('in client');
	var endpoint = 'https://api.twitter.com/oauth/authenticate';
	var url = endpoint + '?' + querystring.stringify(obj);
	res.redirect(url);
	
  // console.log(data);
  }
	
app.get('/twitter/callback',function(req,res)
{ 
var token = url.parse(req.url,true).query;
console.log('in callback');
getKeys(token,res);	
});


//access token 
 function getKeys(code,res){
            Twitter({
  consumer_secret: keys.consumer_secret,
  oauth_verifier:code.oauth_verifier,
  consumer_key: keys.consumer_key,
  oauth_token: code.oauth_token
}, function(err, profile) {
	var a= stringify(profile);
	console.log('got tokens');
  res.send(a);
});
        }
		
		
		
app.use(express.static('pages')); //using sttic page direcectory
app.get('/',function(req,res){
	res.writeHead(200);
	res.sendFile(path.join('/index.html'));
	res.end('Done');
});


//taking tweeting queries
app.get('/tweet',function(req,res)
{
	res.writeHead(200);
	var query = url.parse(req.url,true).query;
	tweet = query.tweet;
	status = {status: tweet};
	tweetIt(status,res);
});
	
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


//*****************************Functions*************************************************

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
		//res.writeHead(200);
		//res.contentType('text/html');
		res.send(obj);
		res.end('Executed');
		
	}
	});
	
}

//For Posting Client Tweet
function tweetIt(status,res)
{
		T.post('statuses/update', status,
		function(err, data, response){
		  if(err)savelog(err,'tweetIt');
		  var PostId = data.id;
		  if(PostId !== undefined)
		  {
		  res.send('Posted' + 'Post id:' + PostId + '<br>' +
					'Your Tweet:' + status.status );
		console.log('Posted' + 'Post id:' + PostId);
		  }
		  else{
			  res.end('Something went Wrong,try Agan later');
			  
		console.log('Error');
		  }
	});
}

//Saving logs 
function savelog(err,method)
{
	var time = new Date().toLocaleString();
	fs.appendFile('logs.txt', os.EOL  + time + ' : Method = ' + method + ' |  Error = ' + err + '|',
	function(err)
	{
		if(err){}
		console.log('log saved');
	});

}

