import ReactDOM from 'react-dom';
import './Home.css';
import React, { Component } from 'react';
import $ from 'jquery';
import slick from 'slick-carousel';
import './slick.css';
import {lastAPIKey, disc_load} from './index.js'
import unknown_image from './unknown_image.png';

var currentLink = 'http://allthemusic.surge.sh/';
//var dataArray = '';
$(document).ready(function(){
  /* Temp code to display 'picks', (this will be done backend side, getting data from MusicBrainz, rather than self supplied)

	Get:
		Title,
		Artist,
		Artwork,
		Link
  */
  if ($('#slick-div').length > 0) { // E-Z Fix to check if 'slick-div' exists (only when on home-page)
  // Request top albums from user (me)



  var albumPicks = [
	  ["Гипер+Утёсов+presents", "Dr.+No's+Ethiopium", 'Madvillainy', 'Kort+Før+Dine+Læber', 'The+Irony+Of+Fate+(Original+Motion+Picture+Soundtrack)', 'Donuts'],
	  ['Messer+für+Frau+Müller', 'Oh+No', 'Madvillain', 'Boom+Clap+Bachelors', 'Mikael+Tariverdiev', 'J+Dilla']
  ];



  //for (var getData = 0; getData < 6; getData++) { */
  var albumInfo;
  var getData = 0;
  function getCall(count) {
      fetch('http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=bloodev&api_key=408297105ca57d03165dad654e5af37c&format=json')
        .then(
            function(response) {
              if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                  response.status);
                return;
              }

              response.json().then(function(data) {
                // Get 6 random albums out of 50
            		var storedData = []
                var rands = [];

                const getRand = function() {
                  let rand = Math.floor(Math.random() * data.topalbums.album.length);
                  if (rands.indexOf(rand) >= 0) {
                    return getRand();
                  } else {
                    rands.push(rand);
                    return rand
                  }
                }

            		for (var x = 0; x < 6; x++) {
                  var rand = getRand()
            			storedData.push({
            				albumArtist: data.topalbums.album[rand].artist.name,
            				artistLink: data.topalbums.album[rand].artist.url,
            				albumName: data.topalbums.album[rand].name,
            				albumLink: data.topalbums.album[rand].url,
            				albumImage: data.topalbums.album[rand].image[3][Object.keys(data.topalbums.album[rand].image[3])[0]]
            			})


                  if (storedData[x].albumImage === '') {
                    storedData[x].albumImage = unknown_image;
                  }
            		}

                const dataArray = storedData;
          		  createPicks(dataArray);
              });
            }
          )
          .catch(function(err) {
            console.log('Fetch Error :-S', err);
          });
  }

	getCall(getData);

  }
});

const Home = () => (
  <div>
	<div id="jumbotron-main" className="jumbotron">
		<div id="jumbo-text" className="text-center">
		  <h1 id="jumbo-main-header">Your gateway to the music</h1>
		  <p id="jumbo-second-header">Search for thousands of artists, tracks or albums!</p>
		  <form id="jumbo-input-form" className="input-form">
			<input id="jumbo-input" className="input-search" type='text' placeholder="Search artists, tracks, or albums"></input>
			<button id="jumbo-btn" type="submit" value="Submit">Search <i className="fa fa-search" aria-hidden="true"></i></button>
		  </form>
		</div>
	</div>

	<div className="container carousel-con">
		<h1 className="text-center">Top Picks<br></br>
		<small>Featuring fresh albums!</small></h1>
		<div id="main-carousel">
			<div id="slick-div" className="slick">
				<img src={disc_load} alt="loader" className="text-center disc-loader"></img>
			</div>
		</div>
	</div>
	<div className="container">
		<div id="top-artist-div" className="col-sm-12 col-md-6">
			<h2 id="top-artist-header">Top Artists</h2>
			<a href={currentLink + 'Charts'} className="see-more-link">See more</a>
			<div id="artist-con">
			</div>
		</div>
		<div id="top-tracks-div" className="col-md-6">
			<h2 id="top-track-header">Top Tracks</h2>
			<a href={currentLink + 'Charts'} className="see-more-link">See more</a>
			<div id="track-con">
			</div>
		</div>
	</div>
  </div>
)

function createPicks(dataArray) {
    const AlbumsPick = dataArray.map((dataArray) =>
  		<div>
    		<a href={currentLink + 'index.html?query=' + dataArray.albumArtist + '&album=' + dataArray.albumName + '&type=album'}>
    			<div className="carousel-album" style={{backgroundImage: "url(" + dataArray.albumImage + ")"}}>
    			</div>
    			<h2 className="album-pick-title">{dataArray.albumName}</h2>
    		</a>
  			<a href={currentLink + "index.html?query=" + dataArray.albumArtist + "&type=artist"}>{dataArray.albumArtist}</a>
  		</div>
	);

	ReactDOM.render(
		<div className="slick-div">{AlbumsPick}</div>,
		document.getElementById('slick-div')
	);

	function createSlick() {
	  $('.slick-div').slick({
		slidesToShow: 4,
		centerMode: true,
		infinite: true,
		arrows: true,
		responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      }
    },
    {
      breakpoint: 720,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 515,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
	]
	  });

	  $('.slick-prev').html('<i class="fa fa-chevron-left" aria-hidden="true"></i>');
	  $('.slick-next').html('<i class="fa fa-chevron-right" aria-hidden="true"></i>');
	}
	createSlick();

	var getTopUser = ['gettopartists', 'gettoptracks']
	var count = 0;
	var trackArtistHold;

	function getTopOf(type) {

		if (JSON.parse(sessionStorage.getItem("dataArray" + getTopUser[count])) != null) {
			trackArtistHold = JSON.parse(sessionStorage.getItem("dataArray" + getTopUser[count]))
			createTracksAlbums(); //'https://ws.audioscrobbler.com/2.0/?method=user.' + type + '&user=bloodev&api_key=' + lastAPIKey + '&format=json'
		} else {	  //'https://ws.audioscrobbler.com/2.0/?method=chart.' + type + '&api_key=' + lastAPIKey + '&format=json'
			$.getJSON('https://ws.audioscrobbler.com/2.0/?method=chart.' + type + '&api_key=' + lastAPIKey + '&format=json', function(response) {
				var trackArtistResponse = response;
				var typeResponse;
				var imageQuality;
				var amountOf;

				if (type === getTopUser[1]) {
					typeResponse = trackArtistResponse.tracks.track
					imageQuality = 1;
					amountOf = 10;
				} else if (type === getTopUser[0]) {
					typeResponse = trackArtistResponse.artists.artist
					imageQuality = 2;
					amountOf = 9;
				}

				function createArr(x, y) { // function to run to create an array
					trackArtistHold = new Array(x);

					for (var i = 0; i < x; i++) {
						trackArtistHold[i] = new Array(y);
					}

					return trackArtistHold;
				}

				createArr(amountOf, 3)

				for (var topTen = 0; topTen < amountOf; topTen++) {
					trackArtistHold[topTen][0] = typeResponse[topTen].name;
					if (type === getTopUser[1]) {
						trackArtistHold[topTen][1] = trackArtistResponse.tracks.track[topTen].artist.name;
					}
					var trackImage = typeResponse[topTen].image[imageQuality] // [2] for size 'Extra Large' (Should confirm if this is the case for all)
					var trackImageArray = $.map(trackImage, function(value, index) { // To turn the object into an array 'imagesArray'
						return [value];
					});

					trackArtistHold[topTen][2] = trackImageArray[0];

				}
				createTracksAlbums()

			});
		}


		function createTracksAlbums() {
			if (type === getTopUser[0]) {
				const ArtistsPick = trackArtistHold.map((trackArtistHold) =>
					<div className="col-sm-6 col-md-4 artist-div">
						<a href={currentLink + 'index.html?query=' + trackArtistHold[0] + '&type=artist'} className="artist-link">
						<div className="artist-album-box" style={{backgroundImage: "url(" + trackArtistHold[2] + ")"}}>
							<h3 className="artist-header">{trackArtistHold[0]}</h3>
						</div>
						<h3 className="artist-header-media">{trackArtistHold[0]}</h3>
						</a>
					</div>
				);

				ReactDOM.render(
					<div>{ArtistsPick}</div>,
					document.getElementById('artist-con')
				);
			} else if (type === getTopUser[1]) {
				const TracksPick = trackArtistHold.map((trackArtistHold) =>
					<div className="track-div">
						<a href={currentLink + 'index.html?query=' + trackArtistHold[1] + '&track=' + trackArtistHold[0] + '&type=track'} className="track-link">
							<div className="track-album-box" style={{backgroundImage: "url(" + trackArtistHold[2] + ")"}}></div>
							<h3 className="track-header">{trackArtistHold[0]}</h3>
						</a>
						<a href={currentLink + "index.html?query=" + trackArtistHold[1] + "&type=artist"}>
							<h3 className="track-artist"><small>{trackArtistHold[1]}</small></h3>
						</a>
					</div>
				);

				ReactDOM.render(
					<div id="track-div-con">{TracksPick}</div>,
					document.getElementById('track-con')
				);
			}
		}

		if (count < getTopUser.length) {
			count++
			getTopOf(getTopUser[count])
		}
	}

	getTopOf(getTopUser[count]);




};

export { Home }
