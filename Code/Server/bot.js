var twit = require('twit');
var keys = require('./keys'); //Configuration keys

var T = new twit(keys);

var status = {status: 'byebye'};

//setInterval(tweetIt,1000*20);
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

