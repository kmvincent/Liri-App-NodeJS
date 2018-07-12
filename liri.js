require("dotenv").config();
const key = require("./key.js");
//------------------VARIABLES----------------------------------------------------
//Loading Modules
//Twitter npm
var Twitter = require('twitter');
var client = new Twitter(key.twitter);
//Spotify npm
var Spotify = require('node-spotify-api');
var spotifyKey = new Spotify(key.spotify);
//OMDP Request npm
var request = require("request");  
var fs = require("fs");

//Global Variable(s)
var action = process.argv[2];
var input = process.argv.slice(3).join(" ");
//-------------------SWITCH----------------------------------------------------
switch (action) {
    case "my-tweets":
	twitter ();
	break;

    case "spotify-this-song":
        if (!input) {
            input = "Amazing Grace"
        }
	    spotify (input);
	break;

    case "movie-this":
        if (!input) {
            input = "Mr. Nobody"
        }
	    movie (input);
	break;

    case "do-what-it-says":
	doit ();
    break;
    
    case "help":
    liribot ();
    break;
};
//-------------------FUNCTIONS----------------------------------------------------
function liribot (){
    console.log(`

         ||||               HI!! I'm LiriBot
         l'''-/             and I am here to help you.
          l__/       o      --------------------------            
           |         )                  ^
           |         |                  |
           |     ____|_____             |
           o    |----------| ___________|
            'l  | [:I] (@) | 
              'l|----------|                    Commands I can process:
                |()()()()()|l                   my-tweets
                | .------. | l       /|__       spotify-this-song <song name>
                | |  --  | |  o-----[  ---      movie-this <movie name>
                | '------' |         '-""'      do-what-it-says
                |----------| 
                 l_ _.._ _/ 
                 (_)(  )(_) 
          v.01       ""

           Thank you for stopping by.
---------------------------------------------------------------------`)
}

function twitter () {
    var params = {user_id: "Kathlee48041351", count: 20, exclude_replies:true, trim_user:true};
    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        if(!err) {
            for (i=0; i<tweets.length; i++) {
                // console.log(tweets[i])
                console.log(tweets[i].text + " " + tweets[i].created_at);
            };
        } else {
            console.log(err)
        };
    });
};

function spotify (input) { 
    spotifyKey.search({ type: 'track', query: input, limit: 1}, function(err, data){ 
        var songInfo = data.tracks.items
        console.log(`
    Artist(s): ${songInfo[0].artists[0].name}
    Song: ${songInfo[0].name}
    Preview url: ${songInfo[0].preview_url}
    Album: ${songInfo[0].album.name}
    `)
        if (err) {
            console.log(err);
        }
    });
    var log = action + ", " + `"${input}"`
    fs.appendFile("log.txt", "\n" + log, function(err) {
        if (err) {
            return console.log(err);
        } console.log("Updating in our system")
    });
};

function movie (input) {
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=c148ee32";
        request(queryUrl, 
        function(error, response, body) {
            if (!error && response.statusCode === 200) {
            console.log(`
    Title: ${JSON.parse(body).Title}
    Year: ${JSON.parse(body).Year}
    IMDB Rating: ${JSON.parse(body).imdbRating}
    Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
    Country produced: ${JSON.parse(body).Country}
    Language: ${JSON.parse(body).Language}
    Plot: ${JSON.parse(body).Plot}
    Actors: ${JSON.parse(body).Actors}
            `)
        };
    });
    var log = action + ", " + `"${input}"`
    fs.appendFile("log.txt", "\n" + log, function(err) {
        if (err) {
            return console.log(err);
        } console.log("Updating in our system")
    });
};

function doit () {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        };
        var dataArr = data.split(",");
        let action = dataArr[0];
        let input = dataArr[1];
        if (action === "spotify-this-song") {
            spotify(input);
        } else if (action === "my-tweets") {
            twitter ();
        } else if (action === "movie-this") {
            movie(input);
        } else console.log(err)
    });
};

//-------------------ISSUES----------------------------------------------------









