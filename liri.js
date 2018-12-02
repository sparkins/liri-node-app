// dotenv and keys are used for environment variables, used in this case for hiding app-ids  
require("dotenv").config();
var keys = require("./keys.js");

// fs library to manipulate files for reading and writing
var fs = require("fs");

// underscore library that was used for _.find to locate the rotten tomatoes rating
var _ = require("underscore");

// axios library is used for request/response with omdb api 
var axios = require("axios");

// node-spotify-abi library was used to access spotify response
var Spotify = require('node-spotify-api');

// bandsInTown library was used to access event data from bandsintown api
var bandsInTown = require('bandsintown')("9c65a36e51a81628371500a805a9bf8c");

// creating a divider to separate data in log.txt
var divider = "\n------------------------------------------------------------\n\n";

// Using process.argv to get the users input in the form of an operation (i.e. concert-this) and search term for lookup (i.e. maroon five)
// console.log("Process Argv: " + process.argv);
var liriOperation = process.argv[2];
// console.log(liriOperation);

// Separating the search term from the rest of the process.argv command, once with + between the search terms and one with a space
var liriSearchTerm = process.argv.slice(3).join("+");
var liriPrintSearchTerm = process.argv.slice(3).join(" ");
// console.log("liri search term: " + liriSearchTerm);

//Switch statement to run the correct function based on user input for liri-bot
switch (liriOperation) {

    case "concert-this":
        console.log("concert.this data is provided to you by BandsInTown");
        concertThis();
        break;

    case "spotify-this-song":
        console.log("spotify-this-song data is provided to you by spotify");
        spotifyThisSong();
        break;

    case "movie-this":
        console.log("You picked movie-this");
        movieThis();
        break;

    case "do-what-it-says":
        console.log("You picked do-what-it-says");
        dowhatitsays();
        // do-what-it-says

        // Then run a request with axios to the OMDB API with the movie specified
        break;

    default:
        console.log("You didn't select an operation for Liri-Bot");

}

// Function to create a request and process the response from BandsInTown for an artist, with an upcoming concert
function concertThis() {
    // var bandsInTown = new BandsInTown(keys.bandsInTown);
    // If no artists is entered, it will default to 'Red Hot Chili Peppers'
    if (!liriSearchTerm) {
        var artist = "Red Hot Chili Peppers";
    }
    else {
        var artist = liriPrintSearchTerm;
    }
    // Create a request and recieve a response from BandsInTown, supplying an artist and retrieving event information
    bandsInTown.getArtistEventList(artist).then(function (events) {
        // console.log(events);
        // Create a cariable to hold the event data for the first event
        var jsonData = events[0];
        if (jsonData === undefined) {
            console.log("There are no upcoming events for "+artist);
            var concertData = ["There are no upcoming events for "+artist];
        }
        else {
            // Create an array to store the data to be stored in log.txt
            var concertData = [
                "Artist: " + artist,
                "Venue Name: " + jsonData.venue.name,
                "Venue Location: " + jsonData.formatted_location,
                "Event Date: " + jsonData.formatted_datetime
            ].join("\n");
        }
        // Write Concert Data to terminal window
        console.log(concertData);

        // Write Concert Data to log.txt
        updateLogFile(concertData);
    }
    );
}

// Function to create a request and process the response from spotify for the track that the user has entered
function spotifyThisSong() {
    var spotify = new Spotify(keys.spotify);
    // If no track is entered, it will default to 'The Sign' by Ace of Base
    if (!liriSearchTerm) {
        var songTitle = "The Sign, Ace of Base";
    }
    else {
        var songTitle = liriSearchTerm;
    }
    // search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
    spotify.search({ type: 'track', query: songTitle }, function (err, response) {
        // Create a variable to store the first song in the response
        var spotifyData = response.tracks.items[0];
        // console.log (spotifyData);

        // Create an array to store the information about the song, that will be written to the log.txt
        var spotifyData = [
            "Artist: " + spotifyData.artists[0].name,
            "Song Link: " + spotifyData.name,
            "Song Preview: " + spotifyData.preview_url,
            "Album: " + spotifyData.album.name,
        ].join("\n");

        // Write the data from the response to the terminal window
        console.log(spotifyData);
        // Write the data to log.txt
        updateLogFile(spotifyData);
    })
}

// Function movieThis, takes the search term, creates a request for the omdb API and then processes the response
function movieThis() {
    // If no movie is entered, it will default to 'Mr Nobody'
    if (!liriSearchTerm) {
        var movieTitle = "Mr Nobody";
    }
    else {
        var movieTitle = liriSearchTerm;
    }
    // create the query for the omdb request
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);
    // Using axios to send the request and retieve the response 
    axios.get(queryUrl).then(async function (response) {
        // console.log (response.data);
        var jsonData = response.data;
        // console.log(jsonData);
        // This code checks if the movie has a rotten tomatoe rating and either saves the rating, or responds no rating is available
        var rottenRatings;
        var rottenIndex = await _.find(jsonData.Ratings, function (rating) {
            return rating.Source === "Rotten Tomatoes"
        })
        // console.log ("index", rottenIndex);
        if (rottenIndex) {
            // console.log("Rotten Tomatoes Rating: " + rottenIndex.Value);
            rottenRatings = rottenIndex.Value;
        }
        else {
            rottenRatings = "This movie does not have a Rottern Tomatoes Rating";
        }

        // Creating an array to hold the data that we are interested in 
        var movieData = [
            "Title: " + jsonData.Title,
            "Release Date: " + jsonData.Released,
            "IMDB Rating: " + jsonData.imdbRating,
            "Rotten Tomatoes Rating: " + rottenRatings,
            "Country produced in: " + jsonData.Country,
            "Language produced in: " + jsonData.Language,
            "Movie plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors
        ].join("\n");

        // Write the data to the terminal
        console.log(movieData);
        // Write the data to the log.txt file 
        updateLogFile(movieData);
    })
}

// This function reads the file random.txt and runs liri.js using the command and search term contained
function dowhatitsays() {
    fs.readFile("./random.txt", "utf8", function read(err, data) {

        if (err) {
            throw err;
        }
        // breakup the file in to an array and then parse the array to get the command and search term
        var dataArr = data.split(",");
        var liriCommand = dataArr[0];
        liriSearchTerm = dataArr[1];
        // if the liricommand is spotify-this-song, then run the spotify-this-song function with the search term from the file
        if (liriCommand === "spotify-this-song") {
            spotifyThisSong()
        }
        else {
            console.log("Error: The command was not Spotify-this-song");
        }
    })
}

// function to take the retrieved data from concert-this, spotify-this-song and movie-this and appends in to the log.txt file
function updateLogFile(logData) {
    // uses fs library to manipulate files.  This command appends to a file named log.txt and adds data passed by the aove functions along with a divider
    fs.appendFile("log.txt", logData + divider, function (err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // Otherwise, it will print: "log.txt was updated!"
        console.log("log.txt was updated!");
    });
}