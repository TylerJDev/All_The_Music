import ReactDOM from 'react-dom';
import './Home.css';
import React, { Component } from 'react';
import $ from 'jquery';
import slick from 'slick-carousel';
import './slick.css';
import {lastAPIKey, disc_load} from './index.js'
var dataArray = []
var storedData = JSON.parse(sessionStorage.getItem("dataArray"));
var currentLink = 'https://tylerjdev.github.io/';

$(document).ready(function(){
  /* Temp code to display 'picks', (this will be done backend side, getting data from MusicBrainz, rather than self supplied) 
  
	Get:
		Title,
		Artist,
		Artwork,
		Link
  */
  if ($('#slick-div').length > 0) { // E-Z Fix to check if 'slick-div' exists (only when on home-page)
  var albumPicks = [
	  ["Гипер+Утёсов+presents", "Dr.+No's+Ethiopium", 'Madvillainy', 'Kort+Før+Dine+Læber', 'The+Irony+Of+Fate+(Original+Motion+Picture+Soundtrack)', 'Donuts'],
	  ['Messer+für+Frau+Müller', 'Oh+No', 'Madvillain', 'Boom+Clap+Bachelors', 'Mikael+Tariverdiev', 'J+Dilla']
  ];
  
  

  //for (var getData = 0; getData < 6; getData++) { */
  var albumInfo;
  var getData = 0;
  function getCall(count) {
	  if (storedData === null) {
		  $.getJSON('https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + lastAPIKey + '&artist=' + albumPicks[1][count] + '&album=' + albumPicks[0][count] + '&format=json', function(response) { 
			var responseGet = response;
			console.log(responseGet);
			var albumImage = responseGet.album.image[3] // [2] for size 'Extra Large' (Should confirm if this is the case for all)
			var imagesArray = $.map(albumImage, function(value, index) { // To turn the object into an array 'imagesArray'
				return [value];
			});
				
			albumInfo = {
				albumName: responseGet.album.name,
				albumImage: imagesArray[0],
				albumArtist: responseGet.album.artist
			}
			
			dataArray.push(albumInfo);
			console.log(dataArray);
			
			if (count === 5) {
				createPicks();
			}
			
			if (getData < 6) {
				getData++
				getCall(getData);
			}
		  });
	  }	else if (storedData != null) {
		  dataArray = storedData;
		  createPicks();
		  
	  }
  }
		getCall(getData);

  }
});

const Home = () => (
  <div>
	<div id="jumbotron-main" className="jumbotron">
		<div id="jumbo-text" className="text-center">
		  <h1 id="jumbo-main-header">Your gateway to the music</h1>
		  <p id="jumbo-second-header">And the people that make it</p>
		  <form id="jumbo-input-form" className="input-form">
			<input id="jumbo-input" className="input-search" type='text' placeholder="Search"></input>
			<button id="jumbo-btn" type="submit" value="Submit"><i className="fa fa-search" aria-hidden="true"></i></button>
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
			<div id="artist-con">
			</div>
		</div>
		<div id="top-tracks-div" className="col-md-6">
			<h2 id="top-track-header">Top Tracks</h2>
			<div id="track-con">
			</div>
		</div>
	</div>
  </div>
)

function createPicks() {
	sessionStorage.setItem("dataArray", JSON.stringify(dataArray));
	
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
			createTracksAlbums();
		} else {
			$.getJSON('https://ws.audioscrobbler.com/2.0/?method=user.' + type + '&user=bloodev&api_key=' + lastAPIKey + '&format=json', function(response) {
				var trackArtistResponse = response;
				var typeResponse;
				var imageQuality;
				var amountOf;
				console.log(trackArtistResponse);
				
				if (type === getTopUser[1]) {
					typeResponse = trackArtistResponse.toptracks.track
					imageQuality = 1;
					amountOf = 10;
				} else if (type === getTopUser[0]) {
					typeResponse = trackArtistResponse.topartists.artist
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
						trackArtistHold[topTen][1] = trackArtistResponse.toptracks.track[topTen].artist.name;
					}
					var trackImage = typeResponse[topTen].image[imageQuality] // [2] for size 'Extra Large' (Should confirm if this is the case for all)
					var trackImageArray = $.map(trackImage, function(value, index) { // To turn the object into an array 'imagesArray'
						return [value];
					});
					
					trackArtistHold[topTen][2] = trackImageArray[0];
					
				}
				sessionStorage.setItem("dataArray" + getTopUser[count], JSON.stringify(trackArtistHold));
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
					<div>{TracksPick}</div>,
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


