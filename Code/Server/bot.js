var twit = require('twit');
var keys = require('./keys'); //Configuration keys
var express = require('express');
var fs = require('fs');
var url = require('url');
var path= require('path');
var os = require('os'); 
var Twitter = require('twitter-oauth-agent');
var request = require('request');


//**************Usable variables*********************//
var app = express();
var T = new twit(keys); //Keys of Clients
var searchQuery = '#paytm'; //query for searching tweets
var tweet="";
var status = {status: tweet}; //tweeting
var cunt = 1;
var query = {q : searchQuery, count: cunt};
//*************SERVER*********************
var server = app.listen(3000,'0.0.0.0',function(){ //0.0.0.0 Listening to machine address
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on ' + host + ":" + port);
});

 
// Get the token and send to the client 
app.get('/',function(req,res)
{
Twitter({
  consumer_key: 'rW6qlDclrN6NcHOagfo7KusqA',
  consumer_secret: 'bkprRlY9qRen0NWbOMIabmZlLlf6VlDFogn1BA7pXxjlBgbwaV',
  callback: 'http://127.0.0.1:3000/twitter/callback'
}, function(err, token) {
  if (err) return res.status(500).send({ error: err.message });
  var link = 'https://api.twitter.com/oauth/authenticate?oauth_token='+token.oauth_token+'&prompt=consent';
  res.writeHead(301,{Location:link});
 
console.log('redirect');  res.end();
});
});

app.get('/twitter/callback',function(req,res)
{ 
var query = url.parse(req.url,true).query;
var oauth_verifier = oauth_verifier;
var oauth_token = query.oauth_token;
getKeys(oauth_verifier,oauth_token);	
});

 function getKeys(oauth_verifier,oauth_token){
            var clientServerOptions = {
                uri: 'https://api.twitter.com/oauth/access_token',
                method: 'POST',
                headers: {
					Authorization: OAuth oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w",
                     oauth_nonce="a9900fe68e2573b27a37f10fbad6a755",
                     oauth_signature="39cipBtIOHEEnybAR4sATQTpl2I%3D",
                     oauth_signature_method="HMAC-SHA1",
                     oauth_timestamp="1318467427",
                     oauth_token="NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0",
                     oauth_version="1.0",
					
                    'Content-Type': 'Content-Type: application/x-www-form-urlencoded'
                }
            }
            request(clientServerOptions, function (error, response) {
                console.log(error,response.body);
                return;
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

