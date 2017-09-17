var twit = require('twit');
var keys = require('./keys'); //Configuration keys

var T = new twit(keys);

var status = {status: 'byebye'};
var cunt = 5;
var searchQuery = '#paytm'; //query for searching tweets
var query = {q : searchQuery, count: cunt};
//setInterval(tweetIt,1000*20);




//For searching Tweet with query
function getTweets(query,cunt)
{
	T.get('search/tweets',query, function(err, data, response) {
		if(err){}
		else{
	  for(var i =0;i<data.statuses.length;i++)
		console.log(data.statuses[i].text +'\n');

	}
	});
}

//For Posting Client Tweet
function tweetIt()
{
		T.post('statuses/update', status,
		function(err, data, response){
		  if(err)console.log(err);
		  var PostId = data.id;
		console.log('Posted' + 'Post id:' + PostId);
	});
}

