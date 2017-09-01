import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './Search.css';
import unknown_image from './unknown_image.png';
import $ from 'jquery';
import {lastAPIKey} from './index.js'
import four_oh_four from './vinyl_animation.gif';

var pageCurrent = 1 // Default, will always start at the first page on script run
var currentSearch = 'artist' // Default, this means it will searching for 'artists' first
var albumTab; // Used to track if tab is 'active' or not, if so it's true
var artistTab = true;
var trackTab; // Used to track if tab is 'active' or not, if so it's true
var searchHold = []; // Used to save the entire 76 query limit call
var searchHoldMulti = [ // Holds results ( [0] index = artists, [1] = albums, [2] = tracks )
[],
[],
[]
]
var results; // Global results var, this holds the results after api is called below
var oldQuery; // Keeps track of query
var prevCall; // Used to keep track of previous page (currentPage), (explained more when it's used)
var currentPage = 1; // Current page on the results of the API, (i.e, page 1 = results 1-84, page 2 = results 84 - 168)
var page = 1; // This is used to keep track of the page, it resets back to 1 (1 being the default starting point) when a new page is called (currentPage)
var currentLink = 'https://tylerjdev.github.io/Music-Artist-Lookup/'

var searchFunc = function(query, pageOf) {
	var queryLimit = 84; // Limit of results you'll get from the API
	function Loader() {
		return (
			  <div id="four-oh-four" className="text-center">
				<img src={four_oh_four} id="404-image"></img>
			</div>
		);
	}
	
	ReactDOM.render(<Loader />, document.getElementById('main-body-container'));
	console.log('Page: ' + page)
	// 84 ( queryLimit ) = max pages for page 1
	console.log(page * 12);
	if (searchHold.length <= 0 || oldQuery != query || page * 12 === 96 || prevCall === true) {
		if (page * 12 === 96) { // If you've reached the max page 8, and if 8 * 12 === the max amount of results from the api call
			currentPage++
			page = 1;
			prevCall = false;
		}
		
		if (oldQuery != query) {
			currentPage = 1;
			page = 1;
		}
		$.getJSON('https://ws.audioscrobbler.com/2.0/?method=' + currentSearch + '.search&' + currentSearch + '=' + query + '&limit=' + queryLimit + '&page=' + currentPage + '&api_key=' + lastAPIKey + '&format=json', function(response) {
			results = response;
			console.log(results);
			searchHold.push(results);
			runSearch(results);
		});
	} else {
		runSearch(results)
	}
	
	function runSearch(resultsOf) {
		var artistArrayLen = 12;
		oldQuery = query;
		
		function toNumber(num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		
		if (currentSearch === 'artist') { // change this
			var artistArrayLen = resultsOf.results.artistmatches.artist.length;
			var searchArtists = resultsOf.results.artistmatches.artist; // 12 results per page
			searchHoldMulti[0][0] = true;
			searchHoldMulti[0][1] = results;
		} else if (currentSearch === 'album') {
			var artistArrayLen = resultsOf.results.albummatches.album.length;
			var searchArtists = resultsOf.results.albummatches.album;
			searchHoldMulti[1][0] = true;
			searchHoldMulti[1][1] = results;
		} else if (currentSearch === 'track') {
			var artistArrayLen = resultsOf.results.trackmatches.track.length;
			var searchArtists = resultsOf.results.trackmatches.track;
			searchHoldMulti[2][0] = true;
			searchHoldMulti[2][1] = results;
		}
		
		console.log(searchHoldMulti);
		
		var resultsTotal = $.map(resultsOf.results, function(value, index) { // To turn the object into an array 'imagesArray'
			return [value];
		});
		
		
		var totalResults = toNumber(Math.ceil(resultsTotal[1] / 12));
		console.log(resultsTotal[1]);
		resultsTotal[1] = toNumber(resultsTotal[1]);
		console.log(totalResults + ' ' + resultsTotal[1]);
		
		function AlbumsCon() {
			if (albumTab === true) {
				var albumTabClass = 'active';
			} else if (artistTab === true) {
				var artistTabClass = 'active'
			} else if (trackTab === true) {
				var trackTabClass = 'active'
			}
			
			//<div id="main-sidebar" className="col-md-3"></div>
			return (
				<div id="main-con" className="container-fluid">
					<div id="main-row" className="row">
						
						<div id="main-body" className="col-md-offset-3 col-md-9">
							<div id="search-tabs">
								<ul className="nav nav-tabs search-tabs">
									<li id="artists-tab" className={"nav-item " + artistTabClass}><a className="nav-link" data-toggle="tab" href="#artist" role="tab" aria-controls="artist">Artists</a></li>
									<li id="album-tab" className={"nav-item " + albumTabClass}><a className="nav-link" data-toggle="tab" href='#album' role="tab" aria-controls='#album'>Albums</a></li>
									<li id="track-tab" className={"nav-item " + trackTabClass}><a className="nav-link" data-toggle="tab" href="#track" role="tab" aria-controls="track">Tracks</a></li>	
								</ul>
							</div>
							<div id="main-header-results">
								<h2>Toal results <small>{resultsTotal[1]}</small></h2>
								<h3><small>{totalResults} pages</small></h3>	
							</div>
							<div id="results">
							</div>
							<div id="pagination">
							</div>
						</div>
					</div>
				</div>
			);
			
		}
	
		ReactDOM.render(<AlbumsCon />, document.getElementById('main-body-container'));
				
		/* function SideBar() {
			return (
				<div id="sidebar">
					<h3>Search results</h3>
					<div id="results-stats">
						<h4>Artists: <small>{resultsTotal[1]} results</small></h4>
						<h4>Albums: <small>{resultsTotal[1]} results</small></h4>
						<h4>Tracks: <small>{resultsTotal[1]} results</small></h4>
					</div>
				</div>
			);
		}
	
		ReactDOM.render(<SideBar />, document.getElementById('main-sidebar')); */
		
		$('a[data-toggle="tab"]').click('shown.bs.tab', function (e) {
			var target = $(e.target).attr("href") // activated tab
			switch (target) {
				case '#artist':
					searchArtist()
					break
				case '#album':
					searchAlbum();
					break
				case '#track':
					searchTrack();
					break
				default:
					
			}
		});
		
		function searchAlbum() {
			currentSearch = 'album';
			albumTab = true;
			page = 1;
			if (artistTab === true || trackTab === true) {
				artistTab = false;
				trackTab = false;
				$('.search-tabs .active').removeClass('nav-link');
			}
			
			if (searchHoldMulti[1][0] === true) {
				results = searchHoldMulti[1][1]
			} else {
				oldQuery = 'new';
			}
			searchFunc(query, 1);
		};
		
		function searchArtist() {
			currentSearch = 'artist';
			artistTab = true;	
			page = 1;
			if (albumTab === true || trackTab === true) {
				albumTab = false;
				trackTab = false;
				$('.search-tabs .active').removeClass('nav-link');
			}
			
			if (searchHoldMulti[0][0] === true) {
				results = searchHoldMulti[0][1]
			} else {
				oldQuery = 'new';
			}
			searchFunc(query, 1);
		};
		
		function searchTrack() {
			currentSearch = 'track';
			trackTab = true;
			page = 1;
			if (albumTab === true || artistTab === true) {
				albumTab = false;
				artistTab = false;
				$('.search-tabs .active').removeClass('nav-link');
			}
			
			if (searchHoldMulti[2][0] === true) {
				results = searchHoldMulti[2][1]
			} else {
				oldQuery = 'new';
			}
			searchFunc(query, 1);
		};
		
		
		var resultsArray;
		var counter = 0;
		
		if (currentSearch === 'track') {
			var arrayLevels = 3;
		} else {
			var arrayLevels = 2;
		}
		
		if (artistArrayLen >= 12) {
			var arrayLen = 12 * page;
			var arrayLvls = 12;
		} else {
			var arrayLen = 12 * page - (12 - artistArrayLen);
			var arrayLvls = arrayLen;
		}
		
		function createArr(x, y) { // function to run to create an array
			resultsArray = new Array(x);
			
			for (var i = 0; i < x; i++) {
				resultsArray[i] = new Array(y);
			}
			
			return resultsArray;
		}
				
		createArr(arrayLvls, arrayLevels) // (first paramater = results limit)
		
		//var resultImgCount = 0; resultImgCount < artistArrayLen; resultImgCount++
		
		// page 1 = 12, > 24 << It's 24 but only 2 results left, 12 - 2 = 10, 10 - 12 = 2
		// page 2 = 24, > 36
		// page 3 = 36, > 48
		console.log('Current: ' + (page - 1) * 12 + ' Next: ' + (12 * page) + ' Current API Page: ' + currentPage);
	
		for (var resultImgCount = (page - 1) * 12; resultImgCount < arrayLen; resultImgCount++) {
			console.log('if ' + resultImgCount + ' < ' + arrayLen);
			if (searchArtists[resultImgCount] != undefined) {	
				var resultImage = searchArtists[resultImgCount].image[2]
				
				var resultImagesArray = $.map(resultImage, function(value, index) { // To turn the object into an array 'imagesArray'
					return [value];
				});
				
				if (resultImagesArray[0] === "") {
					resultsArray[counter][0] = unknown_image;
				} else {	
					resultsArray[counter][0] = resultImagesArray[0];
				}
				
				if (searchArtists[resultImgCount].name.length > 45) {
					resultsArray[counter][1] = searchArtists[resultImgCount].name.substring(0, 45) + '...';
				} else {
					resultsArray[counter][1] = searchArtists[resultImgCount].name
				}
				
				if (currentSearch != 'album') {
					resultsArray[counter][2] = toNumber(searchArtists[resultImgCount].listeners);
				};
				
				if (currentSearch === 'artist') {
					resultsArray[counter][3] = searchArtists[resultImgCount].url.substring(26);
					resultsArray[counter][4] = "";
				} else if (currentSearch === 'album') {
					resultsArray[counter][3] = searchArtists[resultImgCount].artist + '&album=' + resultsArray[counter][1];
					resultsArray[counter][4] = "";
				} else if (currentSearch === 'track') {
					resultsArray[counter][3] = searchArtists[resultImgCount].artist + '&track=' + resultsArray[counter][1];
					resultsArray[counter][4] = "By " + searchArtists[resultImgCount].artist;
				}
					
				counter++;
			} else {
				resultsArray.splice(12 - (arrayLen - resultImgCount), 12)
				break
			}
		}
		
		if (currentSearch === 'album') {
			var listenersDisplay = 'none';
		} else {
			var listenersDisplay = 'block';
		}
							//'src/index.html?query='
		const resultItems = resultsArray.map((resultsArray) =>
			<a href={currentLink + 'index.html?query=' + resultsArray[3] + '&type=' + currentSearch} className="result-link">
				<div className="results-div col-md-12">
					<div className="result-photo col-md-2" style={{backgroundImage: "url(" + resultsArray[0] + ")"}}>
					</div>
					<h3 className="results-header results-name">{resultsArray[1]} <br></br><small>{resultsArray[4]}</small></h3>
					<h4 className="results-header results-meta" style={{display: listenersDisplay}}>Listeners<br></br>
					<small>{resultsArray[2]}</small></h4>
				</div>
			</a>
		
		);

		ReactDOM.render(
			<div>{resultItems}</div>,
			document.getElementById('results')
		);		
		
		
		
		
		/*For that pagination

		Each page has 12 artists/albums/tracks each, so we divide the total results by 12;

		123 / 12 = 10.25

		we ceil (round up) that number, so its 11 (last page will only have a few albums on it)
		
		With the pagination, it will only list up to 5 pages, (i.e 1, 2, 3, 4, 5) and the (...) which will go to the very last page, (note if your above page 5, the (...) will show in the front instead of the back, and will lead to the very first page)
		
		I need a way to know if the page is at the end of its 'cycle' (i.e, on page 5, so it swaps from 1, 2, 3, 4, 5 to 5, 6, 7, 8, 9
		*/
		
		/* 		var pageAmount = 5; // Page amount is the amount of pages left, so if you're on page 10 and there are only 12 pages, this will bet set to 2
		
		const Pagination = Array.apply(null, Array(pageAmount)).map((number, i) => 
			<button className="pagination-button">{i + 1}</button>
		); */
		
		
		ReactDOM.render(
		<div className="text-center pagination-div">
			<div id="prev-pagination"></div>
			<div id="next-pagination"></div>
		</div>,
			document.getElementById('pagination')
		);
		
		function NextPagination() {
			if (page != totalResults) {
				return <button id="next-page-btn" className="pagination-button">Next <i className="fa fa-chevron-right" aria-hidden="true"></i></button>
			} else {
				return null;
			}
		}
	
		ReactDOM.render(<NextPagination />, document.getElementById('next-pagination'));
		
		function PrevPagination() {
			if (page != 1 || currentPage > 1) {
				return <button id="prev-page-btn" className="pagination-button"><i className="fa fa-chevron-left" aria-hidden="true"></i> Prev</button>
			} else {
				return null;
			}
		}
		
	/* 	if (currentPage + 1 != totalPages) { // If the current page is equal to the total amount of pages ( + 1 due to 0 index )
				return <button id="right-btn" className="page-of">Next <i className="fa fa-chevron-right" aria-hidden="true"></i></button>;
			} */
	
		ReactDOM.render(<PrevPagination />, document.getElementById('prev-pagination'));
		
		$('#prev-page-btn').click(function() {
			var prevPage = page -= 1;
			if (currentPage > 1 && page === 0) {
				currentPage--
				page = 7;
				prevCall = true;
			}
			searchFunc(query, prevPage);
		});
		
		$('#next-page-btn').click(function() {
			var nextPage = page += 1;
			console.log(page + ' page')
			searchFunc(query, nextPage);
		});
	}

	
}

export {searchFunc, pageCurrent}
//export default App;
