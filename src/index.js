/* Notes:

BE SURE TO CHANGE H1 TAGS TO PROPER TAGS, DON'T HAVE MULTIPLE H1 TAGS!

*/


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
import unknown_image from './unknown_image.png'; // Tell Webpack this JS file uses this image
import disc_load from './disc_load.png';
import YouTube from 'react-youtube'
import {NavBar, Pages, MainIndex} from './Pages.js';
import {searchFunc} from './Search.js';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&"); // eslint-disable-line
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}// main-navbar
ReactDOM.render(<NavBar />, document.getElementById('main-navbar'));
ReactDOM.render(<Pages />, document.getElementById('main-body-container'));
var queryOf = getParameterByName('query') // Query is for the artist name, (i.e, query=common
var typeOf = getParameterByName('type') // Type can only have one of two values, 'artist' or 'album'
var albumOf = getParameterByName('album') // Album is for the album name, this will only be present if 'type' is 'album'
var trackOf = getParameterByName('track')
var wikiSummary = true; // Determines if there is a 'summary' for the album, if not it will be set to false, but its default is true
var activeTracksRes = false;
var lastAPIKey = '408297105ca57d03165dad654e5af37c';
var artistOf = queryOf
/*Make sure you put artistOf to lowerCase */
var headerDetails;
var bodyDetails;
var albumArray = [ /* Possibly better way to do this? */
[],[],[],[],[],[], [], [], [], [],
];
var eventsArray = [];
var eventCount;
var similarArray = [
[], [], [], [], [], [],
];

var sGeekCheck = [
[],
[],
[],
]
var imagesArray;
// (Not used?) var genresOf = ['Country', 'Pop', 'Rock', 'Alternative', 'Indie', 'Punk', 'Blues', 'Soul', 'Folk', 'Jazz', 'Reggae', 'Classic Rock', 'Hard Rock', 'Electronic', 'Rnb', 'Hip-Hop', 'Rap', 'Funk', 'Latin', 'Classical', 'Techno']
var moment = require('moment');
var albumHold;
var tagsOfLast = [];
var typeArtistAlbum = typeOf;
var albumDetails;
var trackDetails;
var availResources = [];
var availResourcesType = [];
var supportedLanguages = ['en', 'es', 'de', 'fr', 'it', 'ja', 'pl', 'pt', 'ru', 'sv', 'tr', 'zh']
//English, Spanish, German, French, Italian, Japanese, Polish, Portuguese, Russian, Swedish, Turkish, Mandarin
var languageCurrent = sessionStorage.getItem('lang');
var languageIndex;
var currentPage = 0;
if (languageCurrent === null) {
	languageIndex = 0; // default language
} else {
	languageIndex = supportedLanguages.indexOf(languageCurrent);
	$('#language-current').html($('#' + languageCurrent).html()); // Changes text in dropup box to current language
	$('#' + languageCurrent).addClass('selected-lang');
}
var mbidOf;
var currentLink = 'https://tylerjdev.github.io/'

if (typeArtistAlbum === 'track') { 
	$.getJSON('https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=408297105ca57d03165dad654e5af37c&artist=' + artistOf + '&track=' + trackOf + '&lang=' + supportedLanguages[languageIndex] + '&format=json', function(response) {
		var tResponse = response;
		console.log(tResponse);
		
		/* if (tResponse.track.album === undefined) {
			$.getJSON('https://musicbrainz.org/ws/2/artist?query=blu&limit=10&offset=1&fmt=json', function(response) {
				
			});
		} */
		
		/* What I need from the track,
		Playcount,
		Listeners,
		Mbid,
		Tags,
		Album > Title, (mbid) 
		Last.FM Url(s)
		Wiki
		*/
		var playCount = tResponse.track.playcount;
		var listenersTrack = tResponse.track.listeners;
		
		function toNumber(num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		
		trackDetails = {
			trackPlayCount: toNumber(playCount),
			trackListeners: toNumber(listenersTrack),
			trackMBID: tResponse.track.mbid,
			trackTags: tResponse.track.toptags,
			trackAlbumTitle: tResponse.track.album.title,
			trackAlbumMBID: tResponse.track.album.mbid,
			trackLastFmLinks: [tResponse.track.url, tResponse.track.album.url],
			trackWiki: 'No description listed',
		}
		
		if (tResponse.track.wiki != undefined) {
			trackDetails.trackWiki = tResponse.track.wiki.summary;
		}
		
		console.log(trackDetails);
		
		typeArtistAlbum = 'album'
		albumOf = trackDetails.trackAlbumTitle;
		AlbumGet(trackOf)
	});
}

if (typeArtistAlbum === 'artist') {
ReactDOM.render(<MainIndex />, document.getElementById('main-body-container'));
$.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistOf + '&lang=' + supportedLanguages[languageIndex] + '&api_key=' + lastAPIKey + '&format=json', function(response) { 
	var lastFM = response; 
	console.log(response);
	mbidOf = lastFM.artist.mbid;
	var lastFMImages = lastFM.artist.image[2] // [2] for size 'Extra Large' (Should confirm if this is the case for all)
	imagesArray = $.map(lastFMImages, function(value, index) { // To turn the object into an array 'imagesArray'
		return [value];
	});
	artistOf = lastFM.artist.name // To get the 'correct' name
	
	var bioBodyPre = lastFM.artist.bio.summary
	var bioBody = bioBodyPre.substring(0, bioBodyPre.indexOf('<a href="')); //Removes the link to Last, (Only to display the same link on a different page (For the full bio))substring(0, s.indexOf('?'));
	
	var bioBodyFPre = lastFM.artist.bio.content
	var bioBodyF = bioBodyFPre.substring(0, bioBodyFPre.indexOf('<a href="'));
	
	function toNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	headerDetails = {
		nameOf: lastFM.artist.name, // Gets name of Artist from lastFM API
		bioOf: bioBody.substring(0, 250) + '...', // Gets the 'bio' of that artist, but cuts string down to only 250 characters
		listenersOf: toNumber(lastFM.artist.stats.listeners), // Gets the amount of listeners (coming from last.fm)
		photoOf: imagesArray[0], // Gets the photo, (Note: theres different sizes)
		fullBioOf: bioBodyF, // Gets the 'full' bio
	};
	
	bodyDetails = {
		bodyBio: bioBody,
	}
	
	for (var j = 0; j < lastFM.artist.tags.tag.length; j++) {
		tagsOfLast.push(lastFM.artist.tags.tag[j].name.toLowerCase());
	}
	
	console.log(tagsOfLast);
	
	function LoadingAlbums() {
		return <img src={disc_load} alt="loader" className="text-center disc-loader"></img>
	};
								
	ReactDOM.render(<LoadingAlbums />, document.getElementById('album-songs-section'));
	
	$.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artistOf + '&limit=290&api_key=' + lastAPIKey + '&format=json', function(response) { 
		var topAlbumsOf = response;
		console.log(topAlbumsOf);
		
		var albumCount = 10; // Made in order to 'skip' rather than just a numerical value (i.e, 10)
		var arrayCount = 0; // Made in order for the 'array.push' not to 'skip' array index by using 'top10Albums'
		
		for (var top10Albums = 0; top10Albums < albumCount; top10Albums++) {
			var topAlbumName = topAlbumsOf.topalbums.album[top10Albums].name;
			var artistNameAlbum = topAlbumsOf.topalbums.album[top10Albums].artist.name;
			if (topAlbumName === '(null)' || topAlbumName === '') { // If there isn't any name, it will 'skip' this album
				albumCount++;
			} else {
			var albumArt = topAlbumsOf.topalbums.album[top10Albums].image[2]
			var albumImagesArray = $.map(albumArt, function(value, index) { // To turn the object into an array 'imagesArray'
				return [value];
			});
			
			if (albumImagesArray[0] === '') { // If there isn't an image (if no image is supplied, api will return empty string)
				albumArray[arrayCount].push(unknown_image); // If no image is found, it will display 'unknown_image' as a replacement
			} else {
				albumArray[arrayCount].push(albumImagesArray[0]) // Gets image for that album
			}
			//console.log('topAlbumNames ' + topAlbumName + ' ' + arrayCount);
			//console.log(artistNameAlbum);
			
			albumArray[arrayCount].push(topAlbumName);
			albumArray[arrayCount].push(artistNameAlbum);
			albumArray[arrayCount].push(topAlbumsOf.topalbums.album[top10Albums].url.substring(26 + artistNameAlbum.length));
			
			arrayCount++;
			}
			
		}
		
		console.log(albumArray);	
	function AlbumsCon() {
		return (
			<div id="album-section">
				<h1 className="main-body-header">Albums</h1>
				<div className="albums-of">
				</div>
				<button id="view-more-btn" className="text-center btn-type-2">View More</button>
			</div>
			);
	}
	
	ReactDOM.render(<AlbumsCon />, document.getElementById('album-songs-section'));

	const listItems = albumArray.map((albumArray) =>
		<div className="album-div">
		<a className="album-link" href={currentLink + 'index.html?query=' + artistOf + '&album=' + albumArray[1] + '&type=album'}>
			<div className='album-box' style={{backgroundImage: "url(" + albumArray[0] + ")"}}> 
			</div>
		</a>
		<a className="album-link" href={currentLink + 'index.html?query=' + artistOf + '&album=' + albumArray[1] + '&type=album'}>
			<h3 className="album-title"> 
				{albumArray[1]}
			<br></br>
				<small>{albumArray[2]}</small>
			</h3>
		</a>
		</div>
		
	);

	ReactDOM.render(
		<div>{listItems}</div>,
		document.getElementsByClassName('albums-of')[0]
	);
		
	/* Getting 'legit' albums 
		
		Since LastFM, gives you hundreds (if not thousands) of results for albums for an artist (even if that artist has only released a few), I need to be able to sort of ones that are 'legit'.
		For this, I will search within, and up to 290 of the first results, and sort them out. I decided both because of the query limit (290) and that it's already enough to check through, this is a good amount.
		
		Within these 290 results, I will check for these things;
			How big is the 'playcount'.
			If the album has any album art attached to it.
			How many Listeners the aritst already has.
			
		Now first of all, I will always take the first 10 results, if this changes I will change this.
		This is just incase for those more obsecure artists, their only albums wont get sorted out.
		
		
		1. How big is the playcount
			For this, I will take in to account of how many listeners the aritst already has.
			
			So if an artist only has > 1000 listeners, it will take in for account these things:
				If the album has art (takes priority)
				If the album has a playcount of more than (50 ~ 100)
				
			The next tiers of listeners are:
			
			> 1000
				playcount more than 50 ~ 100
			5000
			10,000
			25,000
			50,000
			75,000
			100,000
			200,000
			300,000
			600,000
			800,000
			1,000,000
			< 1,000,000 
				
		*/
		var criteraCount;
		var album_photo_check;
		
		
		switch(true) {
			case (lastFM.artist.stats.listeners < 1000): // At this state, do not check for album covers, just check for the amount of listeners
				criteraCount = 50;
				break;
			case (lastFM.artist.stats.listeners < 5000): // Same as above, but listeners is increased
				criteraCount = 150;
				break;
			case (lastFM.artist.stats.listeners < 10000): // ^ *2
				criteraCount = 200;
				break;
			case (lastFM.artist.stats.listeners < 25000): // This is where album_photo_check is on, from here and up
				criteraCount = 300;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 50000):
				criteraCount = 450;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 75000):
				criteraCount = 500;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 100000):
				criteraCount = 550;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 200000):
				criteraCount = 650;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 300000):
				criteraCount = 800;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 600000):
				criteraCount = 950;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 800000):
				criteraCount = 1100;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners < 1000000):
				criteraCount = 1200;
				album_photo_check = true;
				break;
			case (lastFM.artist.stats.listeners > 1000000):
				criteraCount = 1500;
				album_photo_check = true;
				break;
			default:
				console.log(lastFM.artist.stats.listeners > 1000);
				console.log('default');
		}
		
		var albumArrayGetRan = false; // var for checking if function has ran once already
		var arrayCounting = 0; // var to count how many times the 'if' statement has ran (within albumArrayGet function)
		function albumArrayGet() {
			for (var arrayLenCount = 0; arrayLenCount < topAlbumsOf.topalbums.album.length; arrayLenCount++) {
				var albumArt_Loop = topAlbumsOf.topalbums.album[arrayLenCount].image[2]
				var albumImagesArray_Loop = $.map(albumArt_Loop, function(value, index) { // To turn the object into an array 'imagesArray'
						return [value];
				});
				
				if (album_photo_check === true) {
					if (topAlbumsOf.topalbums.album[arrayLenCount].playcount > criteraCount && albumImagesArray_Loop[0] !== "") { // if the albums 'playcount' is within the critera (see above), and album has a photo link (if not the array sends an empty string "")
						arrayCounting++;
						if (albumArrayGetRan === true) {
							albumHold[arrayCounting][0] = albumImagesArray_Loop[0]; // albumHold[x][0] = album photo link
							albumHold[arrayCounting][1] = topAlbumsOf.topalbums.album[arrayLenCount].name; // albumHold[x][1] = album title/name
							albumHold[arrayCounting][2] = topAlbumsOf.topalbums.album[arrayLenCount].artist.name; // albumHold[x][2] = artist name
							albumHold[arrayCounting][3] = topAlbumsOf.topalbums.album[arrayLenCount].url.substring(26 + artistNameAlbum.length)
						}
					}
				} else {
					if (topAlbumsOf.topalbums.album[arrayLenCount].playcount > criteraCount) { // Same as above if statement, but without checking for album photo
						arrayCounting++;
						if (albumArrayGetRan === true) { // All is same as above
							albumHold[arrayCounting][0] = albumImagesArray_Loop[0];
							albumHold[arrayCounting][1] = topAlbumsOf.topalbums.album[arrayLenCount].name;
							albumHold[arrayCounting][2] = topAlbumsOf.topalbums.album[arrayLenCount].artist.name
							albumHold[arrayCounting][3] = topAlbumsOf.topalbums.album[arrayLenCount].url.substring(26 + artistNameAlbum.length)
						}
					}
				}
			}
			
			/* For pagination
			
			Have two arrays, albumHold being the default, and another that only takes up to 12 'arrays'.
			For example;
				Page 1 : AlbumHold (give 12 'albums') > AlbumPage [currentPage = 1]
				Page 2 : AlbumHold (give 12 more from that 12, so 12 > 24) > AlbumPage [currentPage = 2]
				Page 3 : AlbumHold (give 12 more from that 12, so 24 > 36) > AlbumPage [currentPage = 3]
				
				On click (the pagination (i.e, 1 2 3 4 . . .)) it will advance to that page and put that number into currentPage Array)
				
			*/
			
			if (albumArrayGetRan !== true) {
				function createArr(x, y) { // function to run to create an array
					albumHold = new Array(x);

					for (var i = 0; i < x; i++) {
						albumHold[i] = new Array(y);
					}

					return albumHold;
				}
				albumArrayGetRan = true;
				createArr(arrayCounting + 1, 3) // arrayCounting is the amount of 'filtered' albums, + 1 (cheap fix to an error) extra 'array' level gets removed (see below)
				arrayCounting = 0; // resets var back to 0 for second function run (below)
				albumArrayGet(); // runs the function once more (second call)
			} 
		}
		
		albumArrayGet(); // first call
		
		albumHold.splice(0, 1); // removes the extra 'array' level (it's always at index 0)
		
		/* Possible way to remove duplicate albums 
			Get the name of the album, and match them against eachother;
				If album: (Some Album) has more characters than none in relation to (S o m e, a l b u m) scrap that second album.
				(Some Album) has 9 characters out of 10(in order and (minus the spaces)) of (S o m e, a l b u m), so you may remove the second album.
				
				This would be done on albums that exceed a length of a set amount, for example 10
				Spaces should be ignored with matching
				
				Another example;
				
				(So)ul Amazing
				So(ul) Amazing
					Length = 13;
				
				Both are the same, but with different placements of the () braces.
				

		*/
				
				
		
		console.log('Filtered: ' + arrayCounting);
		
	});
	
	$.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + artistOf + '&api_key=' + lastAPIKey + '&format=json', function(response) {
		var similarOf = response;
		//console.log(similarOf);
		if (similarOf.similarartists.artist.length > 0) {
			for (var getArtists = 0; getArtists < 6; getArtists++) {
				var similarPhoto = similarOf.similarartists.artist[getArtists].image[2];
				var similarImagesArray = $.map(similarPhoto, function(value, index) { // To turn the object into an array 'imagesArray'
					return [value];
				});
				
				//console.log(similarImagesArray);
				if (similarImagesArray[0] === '') {
					similarArray[getArtists].push(unknown_image)
				} else {
					similarArray[getArtists].push(similarImagesArray[0])
				}
				similarArray[getArtists].push(similarOf.similarartists.artist[getArtists].name);
				similarArray[getArtists].push(similarOf.similarartists.artist[getArtists].url.substring(26));
			}
		}
		
		function SimilarCon() {
			return (
				<div id="similar-artists" className="row">
					<h1 className="main-body-header text-center">Similar Artists</h1>
					<div className="Similar-of col-md-12">
						
					</div>
				</div>
				);
		}
		
		ReactDOM.render(<SimilarCon />, document.getElementById('similar-section'));
		/* REPLACE # WITH ACTUAL QUERY LINK (I.E ...?query=PLACEHOLDER_NAME) */
		
		/*Temp fix to above, used 'localhost' instead of actual address, (CHANGE THIS)*/
		const simItems = similarArray.map((similarArray) =>
			<div className="similar-div col-xs-6 col-sm-6 col-md-2">
			<a href={currentLink + 'index.html?query=' + similarArray[2] + '&type=artist'}  id={similarArray[2]} className='similar-link'>
				<div className='similar-box' style={{backgroundImage: "url(" + similarArray[0] + ")"}}> 
					<h3 className="similar-title"> 
					{similarArray[1]}
					</h3>
				</div>
			</a>
			</div>
			
		);

		ReactDOM.render(
			<div>{simItems}</div>,
			document.getElementsByClassName('Similar-of')[0]
		);
		
		//console.log(similarArray);
	});
	
	seatGeekFunction(artistOf);
	
	  /* $.getJSON('https://api.discogs.com/database/search?q=' + headerDetails.nameOf + '&type=artist&token=TZTYjgOxYnFLONQASSSMystPCnVPmmQTgbaZqQOb', function(response) { 
		var discogs = response;
		console.log(discogs);
		
		var artistID = discogs.results[0].id; // Gets the discogs artist 'ID' and holds it (for the next call)
		var pageCount = 1; // Default page number 
		
		 var pageCall = function() {
			
			$.getJSON('https://api.discogs.com/artists/' + artistID + '/releases?sort=format&page=' + pageCount + '&per_page=100', function(response) { 
				var discogsArtist = response;
				console.log(discogsArtist);
				//var testArray = []
				for (var i = 0; i < discogsArtist.releases.length; i++) {
					/* if (testArray.indexOf(discogsArtist.releases[i].role) < 0) {
						testArray.push(discogsArtist.releases[i].role);
					} */
					
	 			/*	if (discogsArtist.releases[i].role == "Main") {
						console.log(discogsArtist.releases[i].title + ' Page: ' + discogsArtist.pagination.page );
					}
				}
				//console.log(testArray); // Array [ "Main", "Remix", "Producer", "Co-producer", "Appearance", "TrackAppearance" ]
				pageCount++;
				if (pageCount <= discogsArtist.pagination.pages) {
					pageCall()
				}
			});
		}
		pageCall(); 
		
		
	});  */ 
	
	
});
/* For track page,
Since search results, and toptracks results do not give the album title of that track, I will have to 'getinfo' on the artist name, and the track name, then I can get the album title, along with other information (i.e, mbid, tags) */
}

var errorRerun = false;

var AlbumGet = function(track) {
	ReactDOM.render(<MainIndex />, document.getElementById('main-body-container'));
	if (errorRerun === true) {
		var getAlbumJson = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=408297105ca57d03165dad654e5af37c&mbid=' + trackDetails.trackAlbumMBID + '&lang=' + supportedLanguages[languageIndex] + '&format=json'
	} else {
		var getAlbumJson = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=408297105ca57d03165dad654e5af37c&artist=' + artistOf + '&album=' + albumOf + '&lang=' + supportedLanguages[languageIndex] + '&format=json'
	}
	
	$.getJSON(getAlbumJson, function(response) { 
		var albumResponse = response
		console.log(albumResponse);

		if (albumResponse.error != undefined && albumResponse.error === 6) { // only for track, find way for if click album
			errorRerun = true;
			AlbumGet(track);
		}
		
		if (albumResponse.album != undefined) {
			var albumPhoto = albumResponse.album.image[2];
		};
		
		var albumPhotoGet = $.map(albumPhoto, function(value, index) { // To turn the object into an array 'imagesArray'
			return [value];
		});

		console.log(albumPhotoGet);
		
		var albumSummary;
		var albumContent;

		
		if (albumResponse.album === undefined || albumResponse.album.wiki === undefined) {
			albumSummary = "No description listed. ";
			albumContent = "No description listed. ";
			
			wikiSummary = false;
		} else {
			var albumSummaryPre = albumResponse.album.wiki.summary
			albumSummary = albumSummaryPre.substring(0, albumSummaryPre.indexOf('<a href="')); //Removes the link to Last, (Only to display the same link on a different page (For the full bio))substring(0, s.indexOf('?'));
			
			var albumContentPre = albumResponse.album.wiki.content
	        albumContent = albumContentPre.substring(0, albumContentPre.indexOf('<a href="'));
		}
		
		
		
		albumDetails = {
			albumBio: albumSummary,
			albumBioFull: albumContent,
			albumTags: albumResponse.album.tags,
			albumPlayCount: albumResponse.album.playcount,
			albumName: albumResponse.album.name,
			albumMbid: albumResponse.album.mbid,
			albumListeners: albumResponse.album.listeners,
			albumImage: albumPhotoGet[0],
			albumTracks: albumResponse.album.tracks,
			albumArtist: albumResponse.album.artist,
			albumWikiLink: albumResponse.album.url + '/+wiki/edit'
		}
		
		var tracksRes = albumDetails.albumTracks;
		var trackLen = tracksRes.track.length;
		var trackArray;
		
		var routeMBID = false;
		
		if (albumResponse.album.tracks.track.length === 0 && trackDetails.trackAlbumMBID != undefined) {
			routeMBID = true;
			$.getJSON('http://musicbrainz.org/ws/2/release/' + trackDetails.trackAlbumMBID + '?inc=artist-credits+url-rels+labels+discids+recordings&fmt=json', function(response) {
				var mbResponse = response
				console.log(mbResponse);
				
				albumDetails.albumImage = 'coverartarchive.org/release/' + trackDetails.trackAlbumMBID + '/front-500.jpg'
				
				//var albumTracks = []
				
				var trackCount = 0;
				
				if (mbResponse.media.length > 1) {
					for (var getAmount = 0; getAmount < mbResponse.media.length; getAmount++) {
						for (var getTracks = 0; getTracks < mbResponse.media[getAmount].tracks.length; getTracks++) {
							trackCount++;	
						}
					}
					
					function createTrackArr(x, y) {
						trackArray = new Array(x);

						for (var i = 0; i < x; i++) {
							trackArray[i] = new Array(y);
						}

						return trackArray;
					}	
		
					createTrackArr(trackCount, 1); //Gets the length of the album
					
					
					
				} else {
					
				}
				
		
				var getTracks = 0;
				var count = 0;
				
				for (var getMedia = 0; getMedia < mbResponse.media.length; getMedia++) {
					var trackLen = mbResponse.media[getMedia].tracks.length; // should be 6
					if (getTracks === trackLen) {
						trackLen += mbResponse.media[getMedia].tracks.length;
						count = 0;
					}
					while (getTracks < trackLen) {
						
						var durationOfTrack = mbResponse.media[getMedia].tracks[count].length / 1000;
						
						trackArray[getTracks] = {
							track: {
								duration: durationOfTrack,
								name: mbResponse.media[getMedia].tracks[count].title,
							}
						}
						getTracks++
						count++
					}
				}
				
				albumDetails.albumTracks = trackArray;
				trackLen = trackCount;
				alert(trackLen);
				console.log(trackArray);
				/* What I need to get from MBID artist tracks..
					Name - 
					Duration -
					Mbid (?)
				*/
				
				
				
				//albumDetails.albumTracks = mbResponse.media
				createTrackEnv(trackLen);
			});
		};
		
		//var albumSongCount = 0;
		
		var arr;
		//var trackInfo;
		
		var createTrackEnv = function(albLen) {
			alert(albLen);
			function SongSection() {
				return (
					<div>
						<h1 className="main-body-header">Songs</h1>
						<div id="songs-album">
						</div>
					</div>
				);
			}
			
			ReactDOM.render(<SongSection />, document.getElementById('songs-section'));	
				
			var albumLengthArr = []
			
			activeTracksRes = true;
			function create(x, y) {
				arr = new Array(x);

				for (var i = 0; i < x; i++) {
					arr[i] = new Array(y);
				}

				return arr;
			}
			
			// Make sure to put something to display if there is no tracks listed!
			console.log(albLen);
			create(albLen, 3); //Gets the length of the album
			
			var trackDuration;
			var trackName;
			
			console.log(trackArray);
			for (var songCount = 0; songCount < albLen; songCount++) {
				
				if (routeMBID != true) {
					trackDuration = tracksRes.track[songCount].duration
					trackName = tracksRes.track[songCount].name
				} else {
					trackDuration = trackArray[songCount].track.duration;
					trackName = trackArray[songCount].track.name
				}
				
				var toMinutes = Math.floor(trackDuration / 60)
				var toSeconds = trackDuration - toMinutes * 60;
				console.log(trackName);
				arr[songCount][0] = trackName;
				if (toSeconds < 10) { // Adds a 0 if to seconds is less than 10, instead of (4:4) it will be (4:40)
					toSeconds = '0' + toSeconds;
				} 

				albumLengthArr.push(parseInt(trackDuration, 10));
				if (toMinutes + ':' + toSeconds === '0:00') {
					arr[songCount][1] = 'Not Listed';
				} else {				
					arr[songCount][1] = toMinutes + ':' + toSeconds
				}

			}
				
				// if (tracksRes.album.tracks.track.length != 0) {
				//	console.log(arr[albumSongCount])
				//	arr[albumSongCount][2] = tracksRes.album.tracks.track.length;
				//} 
				
			var sum = albumLengthArr.reduce(function (a, b) {
				return a + b;
			}, 0);
				
			var tMinutes = Math.floor(sum / 60)
			var tSeconds = sum - toMinutes * 60;
			tSeconds = tSeconds.toString().slice(0, 2);
				
			var albumLength = tMinutes.toString() + ':' + tSeconds;
				
			if (tMinutes > 60) {
				var minsFloor = tMinutes / 60
				albumLength = Math.floor(minsFloor) + ' hr ' + tMinutes.toString().slice(1, 2) + ' min';
			}
				
				
			console.log(albumLength);
		
		
		
		
		//var tracksOf = tracksRes.track
		
		if (albLen === 0) {
			function NoSongs() {
				return (
					<div id="no-events" className="text-center">
						<i className="fa fa-music musicnote-icon" aria-hidden="true"></i>
						<h2>No songs have been listed :(</h2>
						<p>Sorry, no songs have been listed for this album!</p>
					</div>
				);
			}	
			ReactDOM.render(<NoSongs />, document.getElementById('songs-album'));
		} else {
			const songsOf = arr.map((arr, i) =>
				<div className="col-md-12 album-song-div">
					<div className="album-data">
						<p className="song-name">{arr[0]}</p>
						<p className="song-time">{arr[1]}</p>
						
						<div id={'song-details-' + i} className="song-details">
						</div>
					</div>
				</div>
			);
			ReactDOM.render(
				<div id="songs-container">{songsOf}</div>,
				document.getElementById('songs-album')
			);
			
			$('.album-song-div').click(function() {
				track = $(this).find('.song-name').text();
				$('.active-track').removeClass('active-track');
				$('.song-details-div').css('display', 'none');/* .css('display', 'none'); */
				
				clickTrack(track)
			});
		}
		
		var trackInfo = function() {
			$(".song-name").filter(function() {
				return $(this).text() === track;
			}).parent().addClass('active-track');
				
			if ($('.active-track').length === 0) { // If 'active-track' hasn't been added, there is probably something different about the song's name
				$(".song-name").filter(function() {
					return track.indexOf($(this).text()) >= 0; // If the 'track name' has an indexOf( track name on album) = to 0, then add the class to that track, this is a fallback since some track names have added text (i.e, feat. artist), where as the track on the album will not
				}).parent().addClass('active-track');
			}
				
			var activeTrackID = $('.active-track').find('.song-details').attr('id');

			function SongDetails() {
				return (
					<div className="song-details-div">
						<p>Listeners: {trackDetails.trackListeners}</p>
						<p>Play count: {trackDetails.trackPlayCount}</p><br></br>
						<p>{trackDetails.trackWiki}</p>
					</div>
				);
			}
					
			ReactDOM.render(<SongDetails />, document.getElementById(activeTrackID));
			$('html').animate({
				scrollTop: $("#" + activeTrackID).parent().offset().top
			});
		}
		if (track != undefined) {	
			trackInfo();
		} else if (track === undefined) {
			alert('it no go');
		}

		function clickTrack(trackClicked) {
			$.getJSON('https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=408297105ca57d03165dad654e5af37c&artist=' + artistOf + '&track=' + trackClicked + '&lang=' + supportedLanguages[languageIndex] + '&format=json', function(response) {
				var tResponse = response;
				console.log(response);
				
				var playCount = tResponse.track.playcount;
				var listenersTrack = tResponse.track.listeners;
				
				function toNumber(num) {
					return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				
				trackDetails = {
					trackPlayCount: toNumber(playCount),
					trackListeners: toNumber(listenersTrack),
					trackMBID: tResponse.track.mbid,
					trackTags: tResponse.track.toptags,
					trackAlbumTitle: tResponse.track.album.title,
					trackAlbumMBID: tResponse.track.album.mbid,
					trackLastFmLinks: [tResponse.track.url, tResponse.track.album.url],
					trackWiki: 'No description listed',
				}
				
				if (tResponse.track.wiki != undefined) {
					trackDetails.trackWiki = tResponse.track.wiki.summary;
				}

				trackInfo();
			});
		}
	}
	
	if (routeMBID === false) {
		createTrackEnv(trackLen);
	}

		//console.log(albumLength);
			
		/* if (arr[albumSongCount] != undefined) {
			function MetaDataOf() {
				return (
					<div>
						<p className="album-meta-data">Songs: {arr[albumSongCount][2]}</p>
						<p className="album-meta-data">Length: {albumLength}</p>
					</div>
					);
			}
		
			ReactDOM.render(<MetaDataOf />, document.getElementsByClassName('album-meta-data-con')[albumSongCount]);
		} */

		$.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + albumDetails.albumArtist + '&lang=' + supportedLanguages[languageIndex] + '&api_key=' + lastAPIKey + '&format=json', function(response) {
			var lastFM = response;
			for (var j = 0; j < lastFM.artist.tags.tag.length; j++) {
				tagsOfLast.push(lastFM.artist.tags.tag[j].name.toLowerCase());
			}
			
			seatGeekFunction(albumDetails.albumArtist);
		});
	});
}

if (typeArtistAlbum === 'album') {
	AlbumGet()
}

var seatGeekFunction = function(artistName) {
	console.log(artistName);
	$.getJSON('https://api.seatgeek.com/2/performers?q=' + artistName + '&per_page=100&client_id=ODA1MTAyNHwxNDk5MTkyNTk1LjM3', function(response) { 
		var sGeek = response;
		console.log(sGeek);
		var countVar = 0;
		
		var artistNameNum = [
			[],
			[],
		];
		//Who that Artist
		for (countVar = 0; countVar < sGeek.performers.length; countVar++) { // Gets all artists that are of the 'band' type (only within 100 pages)
			//alert(countVar);
			if (sGeek.performers[countVar].type === 'band') { /* Check-1 */
				sGeekCheck[0].push(countVar); // Has the type 'band' -- OK
				//sGeek.performers[countVar].name
			} else {
				console.log('ok');
			}
		}
		
		for (countVar = 0; countVar < sGeekCheck[0].length; countVar++) {
			
			if (sGeek.performers[sGeekCheck[0][countVar]].genres === undefined) {
				//console.log('No genre ' + sGeekCheck[0][countVar]);
				sGeekCheck[0].splice(countVar, 1);
			}

			if (sGeekCheck[0][countVar] !== undefined)  {
				if (sGeek.performers[sGeekCheck[0][countVar]].genres !== undefined) {
					for (var n = 0; n < sGeek.performers[sGeekCheck[0][countVar]].genres.length; n++) {
						if (tagsOfLast.indexOf(sGeek.performers[sGeekCheck[0][countVar]].genres[n].name.toLowerCase()) >= 0 ) { // If there is a tag from LastFM that matches the one for SeatGeek, move on with the if statement
							sGeekCheck[1].push(sGeek.performers[sGeekCheck[0][countVar]].name.toLowerCase()); // Pushes artist's name into Array sGeekCheck[1]
							artistNameNum[0].push(sGeekCheck[0][countVar]); // Pushes their index number into artistNameNum[0]
						}
					}
				}
			}	
		}
		
		sGeekCheck[1] = sGeekCheck[1].filter(function(elem, index, self) { // To remove duplicates from array (*Temp Fix*)
			return index === self.indexOf(elem);
		})
		
		artistNameNum[0] = artistNameNum[0].filter(function(elem, index, self) { 
			return index === self.indexOf(elem);
		})
		
		for (var p = 0; p < sGeekCheck[1].length; p++) {
			if (sGeekCheck[1][p].indexOf(artistName.toLowerCase()) >= 0) { /* Check-2 */
				sGeekCheck[2].push(sGeekCheck[1][p]);
				artistNameNum[1].push(artistNameNum[0][p]);
			}
		}
		
		
		
		// Get the ID for that performer
		if (sGeek.performers[artistNameNum[1][0]] !== undefined) {
			var idOfArtist = sGeek.performers[artistNameNum[1][0]].id;
		} else {
			reactRun();
		}
		// Note: There may be more than one ID at this index, until I improve this query searching, I should give the option for the user to 'select' if this is the incorrect artist
		

		console.log(artistNameNum);
		$.getJSON('https://api.seatgeek.com/2/events?performers.id=' + idOfArtist + '&client_id=ODA1MTAyNHwxNDk5MTkyNTk1LjM3', function(response) {
			console.log(response);
			
			var eventsOf = response;
			for (var countEvents = 0; countEvents < eventsOf.events.length; countEvents++) {
					eventsArray.push(eventsOf.events[countEvents]); /* NOTE: MAKE SURE YOU PUT IF/ELSE FOR IF THE EVENT IS TBD */
					if (eventsArray[countEvents].title.length > 73) {
						eventsArray[countEvents].title = eventsArray[countEvents].title.substring(0, 70) + '...'; // Cuts off 'bio' at 70 char length, if 'bio' is too long, margin/padding breaks
					}
					
					if (eventsArray[countEvents].venue.name.length > 39) {
						eventsArray[countEvents].venue.name = eventsArray[countEvents].title.substring(0, 39) + '...'; // Does same as above
					}
						
			}
			eventCount = eventsOf.events.length;
			console.log(eventsArray);
			for (var priceCount = 0; priceCount < eventsArray.length; priceCount++) {
				if (eventsArray[priceCount].stats.lowest_price === null) {
					eventsArray[priceCount].stats.lowest_price = "Find Tickets";
				} else {
					eventsArray[priceCount].stats.lowest_price = 'From $' + eventsArray[priceCount].stats.lowest_price;
				}
			}
			
			reactRun();
		});
		
		
	});
};

var reactRun = function() {
	//Header Section
	function ReadMoreBtn() {
		if (wikiSummary === true) { 
			return <button id="main-button" className="btn-type-1 read-more-btn">Read More</button>;
		} else {
			return <a href={albumDetails.albumWikiLink} rel="noopener noreferrer" target="_blank"><button id="main-button" className="btn-type-1">Add Description</button></a>; // Return nothing!
		}
	}
	
	function NameOf(props) {
		return (
		<div id="artist-album-dets">
			<div id="artist-of">
			</div>
			<h1 className="name-of">{props.name}</h1>
			<p id='header-bio'>{props.bio}</p>
			{ReadMoreBtn()}
		</div>
		);
	}
	var photoBG;
	
	if (typeArtistAlbum === 'album') {
		photoBG = albumDetails.albumImage;
	} else if (typeArtistAlbum === 'artist') {
		photoBG = headerDetails.photoOf
	};
	
	if (photoBG === '') {
		photoBG = unknown_image;
	};
		
	function PhotoOf() {
		return (
		<div>
			<div id="main-photo" style={{backgroundImage: "url(" + photoBG + ")"}}>
			</div>
		</div>
		);
	}
	
	function HeaderMeta(props) {
		return (
			<div className="header-meta-data">
				<h3 className="meta-header">Listeners:
				<small id="listeners-of"> {props.listenersOf} </small></h3>
				<h3 id="available" className="meta-header">Available On:
				<small id="avail-on"> </small></h3>
			</div>
		);
	}
	
	function ReadMoreLink() {
		if (wikiSummary === true) { 
			return <a href="#" id="read-more-link" className="read-more-btn">Read more...</a>;
		} else {
			return <a href={albumDetails.albumWikiLink} rel="noopener noreferrer" target="_blank">Add Description</a>;
		}
	}
	
	function BiographyCon(props) {
		return (
		<article id="main-bio">
			<h1 className="main-body-header">Biography</h1>
			<p className="bio-of">
			{props.bodyBio}
			{ReadMoreLink()}
			</p>
		</article>
		);
	}
	
	ReactDOM.render(<PhotoOf />, document.getElementById('photo-con'));
	if (typeArtistAlbum === 'artist') {
		ReactDOM.render(
		  <div>
		  <NameOf name={headerDetails.nameOf} bio={headerDetails.bioOf} />
		  <HeaderMeta listenersOf={headerDetails.listenersOf} />
		  </div>,
		  document.getElementById('main-header-con')
		);
		
		ReactDOM.render(
		  <div>
		  <BiographyCon bodyBio={bodyDetails.bodyBio}/>
	      </div>,
	      document.getElementById('bio-section')
	    );
	} else if (typeArtistAlbum === 'album') {
		ReactDOM.render(
		  <div>
		  <NameOf name={albumDetails.albumName} bio={albumDetails.albumBio.substring(0, 250) + '...'} />
		  <HeaderMeta listenersOf={albumDetails.albumListeners} />
		  </div>,
		  document.getElementById('main-header-con')
		);
		
		ReactDOM.render(
		  <div>
		  <BiographyCon bodyBio={albumDetails.albumBio}/>
	      </div>,
	      document.getElementById('bio-section')
	    );
		
		function ArtistName() {
			return <a href={currentLink + 'index.html?query=' + albumDetails.albumArtist + '&type=artist'} id="artist-name">{albumDetails.albumArtist}</a>
		}
	
		ReactDOM.render(<ArtistName />, document.getElementById('artist-of'));
		
	};
	
	// Sidebar Section
	
/* 	function SideBar() {
		return (
			<div>
				<div id="sidebar-details">
					<div>
					</div>
				</div>
			</div>
			);
	}
	
	ReactDOM.render(<SideBar />, document.getElementById('main-sidebar')); */
	
	// Main-body Section
	function OptTabs() {
		if (typeArtistAlbum === 'artist') { /* If type is 'artist', else it won't render */ 
			return <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#albums-songs-tab" role="tab" aria-controls="albums-songs-tab">Albums & Songs</a></li>;
		}
	}
	
	
	function NavPills() { /* Need way to remove/change based on type (i.e, Artist, Album, etc) */
		
		var typeOf_tab;
		
		if (typeArtistAlbum === 'artist') { /* If not 'artist' tab text will be changed to 'details' (i.e, for albums) */
			typeOf_tab = 'Biography';
		} else {
			typeOf_tab = 'Details'
		}
	
		return (
			<ul className="nav nav-tabs">
				<li className="active nav-item"><a className="nav-link" data-toggle="tab" href="#main" role="tab" aria-controls="main">Main</a></li>
				{OptTabs()}
				<li className="nav-item"><a className="nav-link" data-toggle="tab" href='#bio-detail' role="tab" aria-controls='#bio-detail'>{typeOf_tab}</a></li>
				<li className="nav-item"><a className="nav-link" data-toggle="tab" href="#photos" role="tab" aria-controls="photos">Photos</a></li>	
			</ul>
		);
		
		
	}
	
	ReactDOM.render(<NavPills />, document.getElementById('navTabs'));
	
	function EventsCon() {
		return (
			<div id="events-concerts">
				<h1 className="main-body-header text-center">Events</h1>
				<div id="events-div" className="events-of">
					<div className="row events-row">
					</div>
				</div>
			</div>
			);
	}
	
	ReactDOM.render(<EventsCon />, document.getElementById('events-section'));
	
	if (eventCount > 0) { // If there is more than '0' events
		const eventItems = eventsArray.map((eventsArray) =>
			<div className="col-xs-12 col-sm-6 col-md-6 event-box">
				<div className="date-box text-center">
					<p className="month-box">{moment(eventsArray.datetime_local).format('MMMM')}</p>
					<p className="num-box">{moment(eventsArray.datetime_local).format('DD')}</p>
				</div>
				<h3 className="venue-name">{eventsArray.venue.name}</h3>
				<p>{eventsArray.title}</p>
				<p className="meta-event">{eventsArray.venue.display_location}</p>
				<p className="meta-event">{moment(eventsArray.datetime_local).format('MM-DD-YYYY')}</p>
				<a href={eventsArray.url} rel="noopener noreferrer" target="_blank">
					<button className="buy-button">{eventsArray.stats.lowest_price} <i className="fa fa-external-link" aria-hidden="true"></i></button>
				</a>
			</div>
		);

		ReactDOM.render(
			<div>{eventItems}</div>,
			document.getElementsByClassName('events-row')[0]
		);
	} else { // If there is 0 events
		function NoEvents() {
			return (
				<div id="no-events" className="text-center">
					<i className="fa fa-exclamation-circle" aria-hidden="true"></i>
					<h2>No events announced at this time</h2>
						<p>No events have been announced yet... check back soon!</p>
				</div>
				);
		}
	
		ReactDOM.render(<NoEvents />, document.getElementById('events-div'));
	}
	
	$('.read-more-btn').click(function() {
		$('#navTabs .nav-item').removeClass('active');
		$('a[href="#bio-detail"]').parent().addClass('active')
		$('#tab-container div').removeClass('active');
		$('#bio-detail').addClass('active')
		bioSection();
		//aria-expanded="true"
		
		$('html').animate({
			scrollTop: $("#biography-section").offset().top
		});
	});
	
	$('#album-songs-section').on('click', '#view-more-btn', function () {
		$('#navTabs .nav-item').removeClass('active');
		$('a[href="#albums-songs-tab"]').parent().addClass('active')
		$('#tab-container div').removeClass('active');
		$('#albums-songs-tab').addClass('active')
		albumsSongsSection();
		//aria-expanded="true"
	});
	
	$('a[data-toggle="tab"]').click('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href") // activated tab
		
		switch (target) {
			case '#bio-detail':
				bioSection();
				break
			case '#albums-songs-tab':
				albumsSongsSection();
				break
			default:
				
		}
	});
	
	var bioSection = function() {
		var fullBio;
		
		if (typeArtistAlbum === 'album') {
			fullBio = albumDetails.albumBioFull;
		} else if (typeArtistAlbum === 'artist') {
			fullBio = headerDetails.fullBioOf;
		}
		
		function BiographySection() {
			return (
				<div id="biography-section">
					<h1 className="main-body-header">Biography</h1>
					
					<pre className="bio-of">{fullBio}</pre>
				</div>
			);
		}
	
	ReactDOM.render(<BiographySection />, document.getElementById('bio-detail'));
	}
	
	function AlbumsSongs() {
			return (
				<div id="album-songs-section">
					<h2 className="main-body-header">Albums & Songs</h2>
					<div className="album-of row">
						
					</div>
					<div id="pagination">
					</div>
				</div>
			);
		}
	
	ReactDOM.render(<AlbumsSongs />, document.getElementById('albums-songs-tab'));
	
	var albumsSongsSection = function() {
		var pageHold;
		var totalPages = Math.ceil((albumHold.length / 12));
		
		console.log('Pages: ' + totalPages);
		function createNewArr(x, y) { // function to run to create an array
			pageHold = new Array(x);

			for (var i = 0; i < x; i++) {
				pageHold[i] = new Array(y);
			}

			return albumHold;
		}

		createNewArr(12, 4)
		
		var plhvar = 0; // If page 1, 12 * 1, if page 2, 12 * 2, if page 3, 12 * 3
		
		var pageCurrent = 12 * currentPage;

		while (plhvar < 12) { // Loops 12 times, (each page only has 12 albums displayed)
			console.log(plhvar + ' ' + pageCurrent)
			if (albumHold[pageCurrent] === undefined) {
				break
			}
			
			if (albumHold[pageCurrent][0] === '') {
				pageHold[plhvar][0] = unknown_image;
			} else {
				pageHold[plhvar][0] = albumHold[pageCurrent][0]; 
			}
			
			pageHold[plhvar][1] = albumHold[pageCurrent][1];
			pageHold[plhvar][2] = albumHold[pageCurrent][2];
			pageHold[plhvar][3] = albumHold[pageCurrent][3];
			plhvar++;
			pageCurrent++;
		}
		
		if (plhvar < 11) { // Removes empty arrays, (if plhvar isn't 11, that means that the array isn't full, and will leave empty levels, so it will remove starting at the empty array to the length of the array (which is 11(0 based index))
			pageHold.splice(plhvar, 11);
		}
		
		console.log(pageHold);

		/* Add JSON for songs */
	//for (var testVar = 0; testVar < 3; testVar++) {
	if (activeTracksRes === false) { // If this tab is already 'active' (has been clicked and function has ran)
	//var albumSongCount = 0;
	/*var songGet = function() {

		 $.getJSON('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + lastAPIKey + '&artist=' + artistOf + '&album=' + albumArray[albumSongCount][1] + '&format=json', function(response) {
			var tracksRes = response; 
			console.log(tracksRes);
			var albumLengthArr = []
			var arr;
			activeTracksRes = true;
			function create(x, y) {
				arr = new Array(x);

				for (var i = 0; i < x; i++) {
					arr[i] = new Array(y);
				}

				return arr;
			}
			
			
			if (tracksRes.message === 'Album not found') {
				alert('not-found');
			} else {
				create(tracksRes.album.tracks.track.length, 3);
			
			for (var songCount = 0; songCount < tracksRes.album.tracks.track.length; songCount++) {
				
				var toMinutes = Math.floor(tracksRes.album.tracks.track[songCount].duration / 60)
				var toSeconds = tracksRes.album.tracks.track[songCount].duration - toMinutes * 60;
				
				arr[songCount][0] = tracksRes.album.tracks.track[songCount].name
				if (toSeconds < 10) { // Adds a 0 if to seconds is less than 10, instead of (4:4) it will be (4:40)
					toSeconds = '0' + toSeconds;
				} 

				albumLengthArr.push(parseInt(tracksRes.album.tracks.track[songCount].duration, 10));
				arr[songCount][1] = toMinutes + ':' + toSeconds
				
				
				
			}
			
			// if (tracksRes.album.tracks.track.length != 0) {
			//	console.log(arr[albumSongCount])
			//	arr[albumSongCount][2] = tracksRes.album.tracks.track.length;
			//} 
			
			var sum = albumLengthArr.reduce(function (a, b) {
				return a + b;
			}, 0);
			
			var tMinutes = Math.floor(sum / 60)
			var tSeconds = sum - toMinutes * 60;
			tSeconds = tSeconds.toString().slice(0, 2);
			
			var albumLength = tMinutes.toString() + ':' + tSeconds;
			
			if (tMinutes > 60) {
				var minsFloor = tMinutes / 60
				albumLength = Math.floor(minsFloor) + ' hr ' + tMinutes.toString().slice(1, 2) + ' min';
			}
			
			
			
			console.log(albumLength);
			
			var tracksOf = tracksRes.album.tracks.track
		
			const songsOf = arr.map((arr) =>
				<div className="col-md-12">
					<div className="album-data">
						<p>{arr[0]}</p>
						<p className="song-time">{arr[1]}</p>
					</div>
				</div>
			);

			ReactDOM.render(
				<div>{songsOf}</div>,
				document.getElementsByClassName('song-row')[albumSongCount]
			);
			
			console.log(albumLength);
			
			if (arr[albumSongCount] != undefined) {
				function MetaDataOf() {
					return (
					<div>
						<p className="album-meta-data">Songs: {arr[albumSongCount][2]}</p>
						<p className="album-meta-data">Length: {albumLength}</p>
					</div>
					);
				}
		
				ReactDOM.render(<MetaDataOf />, document.getElementsByClassName('album-meta-data-con')[albumSongCount]);
			}
			}
			
			albumSongCount++;
			
			if (albumSongCount < albumArray.length) { //albumArray.length is a placeholder, change this to something else ( for if user clicks 'show more' ) 
				//songGet()
			}
		}); 
	}*/
	//}
		
		const albumTab = pageHold.map((pageHold) =>
		<div className="album-con">
			<div className="album-type">
			<a href={currentLink + 'index.html?query=' + artistOf + '&album=' + pageHold[1] + '&type=album'} className="album-link">
				<div className="col-xs-12 col-sm-6 col-md-3 album-photo-col album-header">
					<div className="album-photo" style={{backgroundImage: "url(" + pageHold[0] + ")"}}>
					</div>
					<div className="album-header">
						<h3 className="album-title">{pageHold[1]}<br></br>
						<small>{pageHold[2]}</small></h3>
						<div className="album-meta-data-con">
						</div>
					</div>	
				</div>
			</a>
			</div>
		</div>
		);

		
		//console.log(albumTab);
		ReactDOM.render(
			<div>{albumTab}</div>,
			document.getElementsByClassName('album-of')[0]
		);
		
		function OptPaginationPrev() {
			if (currentPage !== 0) { // If the current page isn't at the start (0) display the left button
				return <button id="left-btn" className="page-of"><i className="fa fa-chevron-left" aria-hidden="true"></i> Prev</button>;
			}
		} 
		
		function OptPaginationNext() {
			if (currentPage + 1 !== totalPages) { // If the current page is equal to the total amount of pages ( + 1 due to 0 index )
				return <button id="right-btn" className="page-of">Next <i className="fa fa-chevron-right" aria-hidden="true"></i></button>;
			}
		}
		
		function Pagination() {
			return (
				<div id="pagination-div" className="text-center">
					{OptPaginationPrev()}
					{OptPaginationNext()}
				</div>
			);
		}
	
		ReactDOM.render(<Pagination />, document.getElementById('pagination'));
		
		
		
			//songGet()
		}
		
		$('#left-btn').click(function() {
			currentPage--
			albumsSongsSection();
		});
		
		$('#right-btn').click(function() {
			currentPage++
			albumsSongsSection();
		});
	
	}
	
	
	/* $('#read-more-link').click(function() {
		$('a[href="#bio-detail"]').tab('show')
		alert('true');
	}); */
	
	$('.similar-link').click(function() {
		window.location.href="index.html" + "?query=" + $(this).attr('id') + "&type=artist";
	});
	
	
	$.getJSON('https://musicbrainz.org/ws/2/artist/' + mbidOf + '?inc=url-rels+aliases+tags+ratings+artist-rels&fmt=json', function(response) {
		
		/* Data needed from musicbrainz
			
			Social media links:
				Youtube -- OK
				Twitter -- OK
				Facebook -- OK
				Instagram -- OK
				(Other..?)
			
			Group/Band Members
			
			Available on Links: 
				Discogs -- OK > type = 'discogs'
				Spotify -- OK > type = 'streaming music'
				SoundCloud -- OK > type = 'soundcloud'
				BandCamp -- OK > type = 'bandcamp'
				Itunes  -- OK > type = 'purchase for download'
				Google Play > type = 'purchase for download'
				Youtube -- OK > type = 'youtube'
				Last.FM > type = 'last.fm'
				
				
				
			Aliases
			
			For Youtube:
				https://www.googleapis.com/youtube/v3/search?key=AIzaSyAhzndn-GWCUbm3NW0ecBPwORGMXLKhn6Y&channelId=UCRETlWRxI_DDI8pR4Ak7dOA&part=snippet,id&order=viewCount&maxResults=20
		
		*/
		
		var musicBrainz = response;
		console.log(musicBrainz);
		
		//var artistType = musicBrainz.type; // Type being either (person, group, other...) (Use Later)
		
		for (var getRel = 0; getRel < musicBrainz.relations.length; getRel++) {
			var linkType = musicBrainz.relations[getRel].type;
			var linkRel = musicBrainz.relations[getRel];
			if (linkType === 'discogs' || linkType === 'youtube' || linkType === 'soundcloud' || linkType === 'streaming music' || linkType === 'bandcamp' || linkType === 'purchase for download') {
				console.log(musicBrainz.relations[getRel].url.resource);
					if (linkType === 'discogs') {
						availResources.push(linkRel.url.resource);
						availResourcesType.push('discogs');
					} else if (linkType === 'streaming music') {
						if (linkRel.url.resource.indexOf('spotify') >= 0) {
							availResources.push(linkRel.url.resource);
							availResourcesType.push('spotify');
						}
					} else if (linkType === 'soundcloud') {
						availResources.push(linkRel.url.resource);
						availResourcesType.push('soundcloud');
					} else if (linkType === 'bandcamp') {
						availResources.push(linkRel.url.resource);
						availResourcesType.push('bandcamp');
					} else if (linkType === 'purchase for download') {
						if (linkRel.url.resource.indexOf('itunes') >= 0) {
							availResources.push(linkRel.url.resource);
							availResourcesType.push('itunes');
						}
					}
					
					
					
					
					if (linkType === 'youtube') {
						var youtubeUser = musicBrainz.relations[getRel].url.resource.substring(29); // Example link https://www.youtube.com/user/{username_here}
						function LoadingVideo() {
							return <img src={disc_load} alt="loader" className="text-center disc-loader"></img>
						};
								
						ReactDOM.render(<LoadingVideo />, document.getElementById('video-section'));
						console.log(youtubeUser);
						availResources.push(linkRel.url.resource);
						availResourcesType.push('youtube');
						$.getJSON('https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=' + youtubeUser + '&key=AIzaSyAhzndn-GWCUbm3NW0ecBPwORGMXLKhn6Y', function(response) {
							var youtubeIDGet = response; /* Improve this, make sure call waits until it can actually 'grab' the id, then call the next, also make sure calls are spaced out */
							console.log(response);
						
							var channelID = youtubeIDGet.items[0].id;
							$.getJSON('https://www.googleapis.com/youtube/v3/search?key=AIzaSyAhzndn-GWCUbm3NW0ecBPwORGMXLKhn6Y&channelId=' + channelID + '&part=snippet,id&order=viewCount&maxResults=10', function(response) {
									console.log(response);
									var youtubeArray = []
									var listLength = 3;
									var videosArray = response;
									var currentVideoIndex = 0; // first video of the array
									var videoClicked = false; // If this is false, if the user clicks one of the video on the 'side' list, it will display the image, and won't call the component 'YoutubePlayer', until they actually decide to click it */
									var listOfVideos = videosArray.items
									console.log(listOfVideos[0]);
									
									function PlayerCon() {
										return (
											<div id="video-div" className="col-md-12">
											<h1 className="rebel-body-header">Videos</h1>
												<div id="player" className="col-md-12 col-lg-7">	
												</div>
												<div className="video-list col-md-12 col-lg-5">
													<div id="vids-of" className="videos-of">
													</div>
													<div id="show-more-list">
													</div>
												</div>
											</div>
										);
									}
								
									ReactDOM.render(<PlayerCon />, document.getElementById('video-section'));
									
									function ListButton() {
										return (
											<div id="list-button">
												<button className="text-center btn-type-2">View More</button>
											</div>
										);
									}
								
									ReactDOM.render(<ListButton />, document.getElementById('show-more-list'));
									
									$('#list-button').click(function() {
										$(this).remove()
										listLength = 7;
										youtubeArray = []
										$('.videos-of').empty();
										$('.video-list').css('overflow', 'auto');
										videoList();
									});
									
									//<h4 id="yt-title">{listOfVideos.snippet.title}</h4>
									
									var videoList = function() {
										for (var maxResults = 0; maxResults < listLength; maxResults++) {
											youtubeArray.push(videosArray.items[maxResults]);
										}
									
										const vidList = youtubeArray.map((youtubeArray) =>
											<div className="box-of-thumb col-md-12">
												<div className="video-thumb-box col-sm-5" style={{backgroundImage: "url(" + youtubeArray.snippet.thumbnails.high.url + ")"}}>
												</div>
												<div className="meta-video-box col-sm-7">
													<h4 id="yt-title">{youtubeArray.snippet.title.substring(0, 55)}<br></br>
													<small>{youtubeArray.snippet.channelTitle}</small></h4>
												</div>
											</div>
											
										);

										ReactDOM.render(
											<div>{vidList}</div>,
											document.getElementsByClassName('videos-of')[0]
										);			
									}
									
									videoList();
									
									function VideoHolder() { /* a 'mockup' youtube video display, as to not call the youtube comp below, until user is 'ready' */
										return (
											<div id="video-holder">
												<div id="video-image" style={{backgroundImage: "url(" + listOfVideos[0].snippet.thumbnails.high.url + ")"}}>
													<i className="fa fa-youtube-play text-center" aria-hidden="true"></i>
												</div>
											</div>
										);
									}
	
									ReactDOM.render(<VideoHolder />, document.getElementById('player'));
									
									$('.videos-of').on('click', '.box-of-thumb', function() {
										var currentImageLink = $(this).children('.video-thumb-box').css('background-image');
										$('#video-image').css('background-image', currentImageLink);
										//console.log($(this).children('.video-thumb-box').css('background-image'));
										currentVideoIndex = $(this).index();
										if (videoClicked === true) {
											youtubeIframeFunc()
										}
									});
									
									
									$('#video-holder').click(function() {
										youtubeIframeFunc()
									});
									
									var youtubeIframeFunc = function() {
										videoClicked = true;
										class YoutubePlayer extends React.Component {
										  render() {
											const opts = {
											  height: '390',
											  width: '100%',
											  playerVars: { // https://developers.google.com/youtube/player_parameters
												autoplay: 1
											  }
											};

											return (
											  <YouTube
												videoId={videosArray.items[currentVideoIndex].id.videoId}
												opts={opts}
												onReady={this._onReady}
											  />
											);
										  }

										  _onReady(event) {
											// access to player in all event handlers via event.target
											//event.target.pauseVideo();
										  }
										}

										ReactDOM.render(<YoutubePlayer />, document.getElementById('player'));
									}
									
									


							});
								
						});
					}
			}
			//var bioBodyF = bioBodyFPre.substring(0, bioBodyFPre.indexOf('<a href="'));
			
			if (linkType === 'social network') {
				console.log(linkRel.url);
				if (linkRel.url.resource.indexOf('facebook') >= 0 || linkRel.url.resource.indexOf('instagram') >= 0 || linkRel.url.resource.indexOf('twitter') >= 0) {
					console.log(musicBrainz.relations[getRel].url.resource);
					//availResources.push(musicBrainz.relations[getRel].url.resource);
				}
				
				
			}
		}
		
		const AvailableOn = availResources.map((availResources, i) =>
			<a href={availResources} rel="noopener noreferrer" target="_blank"><i className={"avail-on fa fa-" + availResourcesType[i]} aria-hidden="true"></i></a>
		);
		
		// if class is fa-discogs..

		ReactDOM.render(
			<div className="avail-on-div">{AvailableOn}</div>,
			document.getElementById('avail-on')
		);
		
		if ($('.avail-on').hasClass('fa-discogs')) {
			$('.fa-discogs').addClass('glyphicon glyphicon-cd');
			$('.fa-discogs').removeClass('fa fa-discogs');
		} 
		
		if ($('.avail-on').hasClass('fa-itunes')) {
			$('.fa-itunes').addClass('fa-apple');
			$('.fa-itunes').removeClass('fa-itunes');
		}
		
	});
	
};

$('.d-list-item').click(function() {
	sessionStorage.setItem('lang', $(this).attr('id'));
	window.location.reload();
});

$('.input-form').on('submit', function () {
	var searchQuery = $('.input-search', this).val();
	var defPage = 1;
	searchFunc(searchQuery, defPage);
    return false;
});

export {lastAPIKey, disc_load};