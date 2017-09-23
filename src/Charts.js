import ReactDOM from 'react-dom';
import './Charts.css';
import React, { Component } from 'react';
import $ from 'jquery';
import slick from 'slick-carousel';
import './slick.css';
import {lastAPIKey, disc_load, supportedLanguages, languageIndex} from './index.js'
var dataArray = []
var storedData = JSON.parse(sessionStorage.getItem("dataArray"));
var currentLink = 'http://localhost:3000/src/';
var artistName;
// dont forget to put a if check so this will only run if condition is met
const Charts = () => (
  <div id="charts">
	<div id="main-charts-banner" className="container-fluid">
	</div>
	<div id="top-artist-carousel" className="container">
	</div>
	<div id="top-albums-tracks" className="container">
		<div id="top-albums-charts">
		</div>
		<div id="top-tracks-charts">
		</div>
	</div>
  </div>
)


$(document).ready(function(){
if ($('#charts').length > 0) {
  $.getJSON('https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=' + lastAPIKey + '&format=json', function(response) {
	var topCharts = response;
	var artistsMBID;
	var artistLinkName;

	function getChartArtist(count) {
		var topCharts = response;
		console.log(topCharts);
		artistName = topCharts.artists.artist[count].name;
		artistLinkName = topCharts.artists.artist[count].url.substring(26);
		var listenersCount = topCharts.artists.artist[count].listeners;
		artistsMBID = topCharts.artists.artist[count].mbid;
		
		function toNumber(num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		
		listenersCount = toNumber(listenersCount);
		
		const ChartsBanner = () => (
		  <div>
				<h1 id="charts-header">{'#' + (count + 1) + ' ' + artistName} <small id="top-meta-count">Listeners: <span id="charts-listeners">{listenersCount}</span></small></h1>
				<div id="charts-tags">
				
				</div>
				<div id="available-charts">
				</div>
		  </div>
		)

		ReactDOM.render(<ChartsBanner />, document.getElementById('main-charts-banner'));
		
		getChartMeta();
	}
	
	function CarouselCharts() {
		return (
			<div>
				<h2 className="text-center">Top 20 Artists</h2>
				<div id="charts-slick-div" className="slick">
					<img src={disc_load} alt="loader" className="text-center disc-loader"></img>
				</div>
			</div>
		);
	}
		
	ReactDOM.render(<CarouselCharts />, document.getElementById('top-artist-carousel'));
	
	getChartArtist(1);
	
	var top20 = [];

	for (var s = 0; s < 20; s++) {
		var artistPhotoGet = $.map(topCharts.artists.artist[s].image[2], function(value, index) { // To turn the object into an array 'imagesArray'
			return [value];
		});
			
		var artistDetails = {
			artistName: topCharts.artists.artist[s].name,
			albumPhoto: artistPhotoGet[0],
			artistCount: s + 1, // due to zero-based index
		};
		
		top20.push(artistDetails);
	};
	
	console.log(top20);
	
	const ChartsArtistAlbum = top20.map((top20) =>
		<div className="chart-artists-div">
			<a href='#' className="chart-artists">
				<div className="carousel-album-charts" style={{backgroundImage: "url(" + top20.albumPhoto + ")"}}>
				</div>
			</a>
			<a href={currentLink + "index.html?query=" + top20.artistName + "&type=artist"} className="charts-artists-link">{'#' + top20.artistCount + ' ' + top20.artistName}</a>
			</div>
		);

	ReactDOM.render(
		<div className="charts-slick-div">{ChartsArtistAlbum}</div>,
		document.getElementById('charts-slick-div')
	);
	
	function createSlick() {
		  $('.charts-slick-div').slick({
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
		
		$('.chart-artists-div').click(function() {
			var rank = $(this).find('.charts-artists-link').text().match(/\d+/)[0];
			rank = rank - 1;
			//alert(rank);
			getChartArtist(rank);
		});
		
		$.getJSON('https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=' + lastAPIKey + '&format=json', function(response) { 
			var topTagsResponse = response;
			console.log(topTagsResponse);
			
			
			var tagsArr = [];
			var amountOfTags = 20;
			for (var tags = 0; tags < amountOfTags; tags++) {
				tagsArr.push(topTagsResponse.toptags.tag[tags].name);
			}
			
			console.log(tagsArr);
			var getRandTag = Math.floor(Math.random() * amountOfTags);
			
			var tagPicked = tagsArr[getRandTag];
			
			gTopAlbums(tagPicked);
			
			function gTopAlbums(tag) {
				$.getJSON('https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=' + tag +'&api_key=' + lastAPIKey + '&format=json', function(response) { 
					var topCAlbumArr = response;
					console.log(response);
					
					var tagName = tag[0].toUpperCase() + tag.substring(1, tag.length); // Changes the first letter of the tag to uppercase, instead of lowercase
					function TopAlbumsCharts() {
						return (
							<div className="col-md-6">
								<h2 id="top-albums-charts-header" className="text-center">Top albums: </h2>
								<div className="dropdown charts-dropdown">
									<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><small id="genre-selector">{tagName} <i className="fa fa-caret-down" aria-hidden="true"></i></small></button>
									<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
										<div id="tag-dropdown-menu">
										</div>
										 <div className="dropdown-divider">
										 </div>
										 <a className="dropdown-item seperated-item" href="#">See more...</a>
									</div>
								</div>
									<div id="top-albums-con">
										<img src={disc_load} alt="loader" className="text-center disc-loader"></img>
									</div>
							</div>
						);
					};
					
					ReactDOM.render(<TopAlbumsCharts />, document.getElementById('top-albums-charts'));
					
					const TopAlbumsTags = tagsArr.map((tagsArr) =>
						<a id={tagsArr + '-chart'}className="dropdown-item genre-dropdown" href="#">{tagsArr}</a>
					);

					ReactDOM.render(
						<div>{TopAlbumsTags}</div>,
						document.getElementById('tag-dropdown-menu')
					);
					
					
					$('.genre-dropdown').click(function() {
						var cTag = $(this).text();
						if (cTag !== tag) {
							gTopAlbums(cTag);
						}
					});
					
					
					$('#' + tag + '-chart').addClass('active-dropdown');
					
					
					var topCArray = [];
					
					for (var albums = 0; albums < 6; albums++) {
						var albumCPhoto = $.map(topCAlbumArr.albums.album[albums].image[2] , function(value, index) { // To turn the object into an array 'imagesArray'
							return [value];
						});
						
						var albumCDetails = {
							albumName: topCAlbumArr.albums.album[albums].name,
							albumArtistName: topCAlbumArr.albums.album[albums].artist.name,
							albumPhoto: albumCPhoto[0],
						};
						
						topCArray.push(albumCDetails);
					}
					
					const Albums4Chart = topCArray.map((topCArray) =>
						<div className="chart-Albums">
							<a href={currentLink + 'index.html?query=' + topCArray.albumArtistName + '&album=' + topCArray.albumName + '&type=album'} className="album-link">
								<div className="track-album-box charts-album-box" style={{backgroundImage: "url(" + topCArray.albumPhoto + ")"}}></div>
								<h3 className="album-header">{topCArray.albumName}</h3>
							</a>
							<a href={currentLink + "index.html?query=" + topCArray.albumArtistName + "&type=artist"}>
								<h3 className="album-artist"><small>{topCArray.albumArtistName}</small></h3>
							</a>
						</div>
					);

					ReactDOM.render(
						<div>{Albums4Chart}</div>,
						document.getElementById('top-albums-con')
					);
					
					/* <div className="track-div">
							<a href={currentLink + 'index.html?query=' + trackArtistHold[1] + '&track=' + trackArtistHold[0] + '&type=track'} className="track-link">
								<div className="track-album-box" style={{backgroundImage: "url(" + trackArtistHold[2] + ")"}}></div>
								<h3 className="track-header">{trackArtistHold[0]}</h3>
							</a>
							<a href={currentLink + "index.html?query=" + trackArtistHold[1] + "&type=artist"}>
								<h3 className="track-artist"><small>{trackArtistHold[1]}</small></h3>
							</a>
						</div> */
				});
			}
				$.getJSON('https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=' + lastAPIKey + '&format=json', function(response) { 
					var topCTrack = response;
					console.log(response);
					
					function TopTrackCharts() {
						return (
							<div className="col-md-6">
								<h2 className="text-center">Top Tracks:</h2>
									<div id="top-tracks-con">
										<img src={disc_load} alt="loader" className="text-center disc-loader"></img>
									</div>
							</div>
						);
					};
					
					ReactDOM.render(<TopTrackCharts />, document.getElementById('top-tracks-charts'));
					
					var topCTArray = [];
				
					for (var track = 0; track < 6; track++) {
						var albumCTPhoto = $.map(topCTrack.tracks.track[track].image[2] , function(value, index) { // To turn the object into an array 'imagesArray'
							return [value];
						});
						
						var trackCDetails = {
							trackName: topCTrack.tracks.track[track].name,
							trackArtistName: topCTrack.tracks.track[track].artist.name,
							trackPhoto: albumCTPhoto[0],
						};
						
						topCTArray.push(trackCDetails);
					}
				
					const Tracks4Chart = topCTArray.map((topCTArray) =>
						<div className="chart-Albums">
							<a href={currentLink + 'index.html?query=' + topCTArray.trackArtistName + '&track=' + topCTArray.trackName + '&type=track'} className="album-link">
								<div className="track-album-box charts-album-box" style={{backgroundImage: "url(" + topCTArray.trackPhoto + ")"}}></div>
								<h3 className="album-header">{topCTArray.trackName}</h3>
							</a>
							<a href={currentLink + "index.html?query=" + topCTArray.trackArtistName + "&type=artist"}>
								<h3 className="album-artist"><small>{topCTArray.trackArtistName}</small></h3>
							</a>
						</div>
					);

					ReactDOM.render(
						<div>{Tracks4Chart}</div>,
						document.getElementById('top-tracks-con')
					);
					
				}); 
					
					
				
			
		
		});
	
	function getChartMeta() {
		$.getJSON('https://musicbrainz.org/ws/2/artist/' + artistsMBID + '?inc=url-rels+aliases+tags+ratings+artist-rels&fmt=json', function(response) {
			var chartsMBID = response;
			console.log(response);
			var linksOf = [
				[],
				[]
			]
			for (var i = 0; i < chartsMBID.relations.length; i++) { 
			
				switch (chartsMBID.relations[i].type) {
					case 'image':
						console.log(chartsMBID.relations[i].url.resource);
						break;
					case 'social network':
						console.log(chartsMBID.relations[i].url.resource);
						
						if (chartsMBID.relations[i].url.resource.indexOf('twitter') >= 0) {
							linksOf[0].push('twitter');
							linksOf[1].push(chartsMBID.relations[i].url.resource);
						} else if (chartsMBID.relations[i].url.resource.indexOf('facebook') >= 0) {
							linksOf[0].push('facebook');
							linksOf[1].push(chartsMBID.relations[i].url.resource);
						}
						
						break;
					case 'youtube':
						linksOf[0].push('youtube');
						linksOf[1].push(chartsMBID.relations[i].url.resource);
						break
					case 'discogs':
						linksOf[0].push('discogs');
						linksOf[1].push(chartsMBID.relations[i].url.resource);
						break;
					case 'purchase for download':
						//itunes
						//play.google
						//amazon
						break;
					case 'soundcloud':
						linksOf[0].push('soundcloud');
						linksOf[1].push(chartsMBID.relations[i].url.resource);
						break;
					case 'streaming music':
						if (chartsMBID.relations[i].url.resource.indexOf('spotify') >= 0) {
							linksOf[0].push('spotify');
							linksOf[1].push(chartsMBID.relations[i].url.resource);
						}
						break;
					default:
						break
				};
			}
			
			//console.log(linksOf);
			const AvailLinks = linksOf[0].map((linksOf) =>
				<a href="#" className="avail-charts"><i className={"avail-charts-icon fa fa-" + linksOf} aria-hidden="true"></i></a>
			);
						
			ReactDOM.render(
				<div>{AvailLinks}</div>,
				document.getElementById('available-charts')
			);
			
			if ($('.avail-charts-icon').hasClass('fa-discogs')) {
				$('.fa-discogs').addClass('glyphicon glyphicon-cd');
				$('.fa-discogs').removeClass('fa fa-discogs');
			} 
		});
		
		$.getJSON('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistLinkName + '&lang=' + supportedLanguages[languageIndex] + '&api_key=' + lastAPIKey + '&format=json', function(response) { 
			var chartsArtist = response;
			console.log(chartsArtist);
			var artistTags = chartsArtist.artist.tags.tag;
			
			const ChartsTags = artistTags.map((artistTags) =>
				<div className="tags-con"><p className="tags-artist">{artistTags.name}</p></div>
			);
						
			ReactDOM.render(
				<div>{ChartsTags}</div>,
				document.getElementById('charts-tags')
			);
		});
	}
  });
}
});

export { Charts }


