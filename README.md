# liri-node-app
## LIRI is a Language Interpretation and Recognition Interface.

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.
---

To use Liri you would use the command 'node liri.js' followed by the command and the search term, below are some examples:

* node liri.js concert-this Red Hot Chili Peppers
* node liri.js spotify-this-song Thriller
* node liri.js movie-this Pulp Fiction
* node liri.js do-what-it-says

---

- 'concert-this:' This command uses the BandsInTown API to look up an upcoming concerts for the requested artist.  It returns data for the first event, prints it to the terminal window as well as to an external file, log.txt.  If no artist is entered it will print the default, Red Hot Chili Peppers.

- 'spotify-this-song:' This command uses the Spotify API to look up details for the requested song/track.  It returns data for the first match, prints it to the terminal window as well as to an external file, log.txt.  If no movie is entered it will print the default, The Sign, by Ace of Base.

- 'movie-this:' This command uses the OMDB API to look up details for the requested movie.  It returns data for the first movie, prints it to the terminal window as well as to an external file, log.txt.  If no movie is entered it will print the default, Mr Nobody.

- 'do-what-it-says:' This command reads from an external file, random.txt.  Parses the command (which is spotify-this-song) and the search term.  Then executes the function spotify-this-song, with the search term.

