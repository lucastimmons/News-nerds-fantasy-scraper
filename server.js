var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

//The teams in the league
var urls = ['http://fantasy.premierleague.com/entry/1095557/event-history/','http://fantasy.premierleague.com/entry/2581232/event-history/', 'http://fantasy.premierleague.com/entry/1081086/event-history/', 'http://fantasy.premierleague.com/entry/2619852/event-history/', 'http://fantasy.premierleague.com/entry/1060667/event-history/', 'http://fantasy.premierleague.com/entry/1005234/event-history/', 'http://fantasy.premierleague.com/entry/1005882/event-history/', 'http://fantasy.premierleague.com/entry/999567/event-history/', 'http://fantasy.premierleague.com/entry/1667842/event-history/', 'http://fantasy.premierleague.com/entry/567241/event-history/', 'http://fantasy.premierleague.com/entry/1007621/event-history/', 'http://fantasy.premierleague.com/entry/1059373/event-history/', 'http://fantasy.premierleague.com/entry/2213686/event-history/', 'http://fantasy.premierleague.com/entry/1155714/event-history/', 'http://fantasy.premierleague.com/entry/1655398/event-history/', 'http://fantasy.premierleague.com/entry/1655465/event-history/', 'http://fantasy.premierleague.com/entry/1004362/event-history/', 'http://fantasy.premierleague.com/entry/1049693/event-history/', 'http://fantasy.premierleague.com/entry/2447339/event-history/', 'http://fantasy.premierleague.com/entry/1431925/event-history/', 'http://fantasy.premierleague.com/entry/1005351/event-history/'];

// Which week you want, the URL structure for the teams requires you to enter in a game week. It is appeneded in var thisurl on line 16.
var currentWeek = 1;

for (i = 0; i < urls.length; i++) {
	var thisurl = urls[i] + currentWeek;
	request(thisurl, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    //create the team results for that week
	    var parsedResults = [];
	    //create the results with the title for json
	    var fantasyResults = [];
	    //Get the team name from the tab at the top of the page
	    var teamname = $('.ismTabHeading').text();
	    //Run through each player on the page, including subs with 0 points that week.
	    $('.ismPlayerContainer').each(function(i, element){
	      // Get the data for the player container
	      var a = $(this);
	      // Get the player name and then get rid of the spaces
	      var player = a.children('.ismElementDetail').children(0).text();
	      player = player.trim();
	      // Get the player's points and get rid of the line breaks and spaces
	      var points = a.children('.ismElementDetail').children(1).text();
		  points = points.trim();
		  // Get the team the player plays on based on their shirt shown on the screen from the title attr in the image tag
		  var team = a.children('.JS_ISM_SHIRT').children().attr('title');
		  //set up the array
	      var metadata = {
	        player: player,
	        points: points,
	        team: team
	      };
	      // Push meta-data into parsedResults array
	      parsedResults.push(metadata);

	    });
	    //This is to make it into json pretty easily
	    var fantasydata = {
		      fantasyname: teamname,
		      stats: parsedResults
	      };
	      fantasyResults.push(fantasydata);

	    // Log our json in the terminal and write it to files
		// THIS DOESN'T WORK YET, IT WRITES TOO FAST NO BUFFER, FILES ARE DESTROYED, IT'S PANDEMONIUM. So just copy the json from your console. Or fork this and fix it, whatever.
		/*
	    	var jsonout = "output" + i + ".json";
	    	fs.writeFile(jsonout, JSON.stringify(fantasyResults), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        }) */
		console.log(JSON.stringify(fantasyResults));
	  }
	});
}

})

app.listen('8081')
console.log('Open your browser to http://localhost:8081/scrape');
exports = module.exports = app;