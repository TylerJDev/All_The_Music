import ReactDOM from 'react-dom';
import './Genres.css';
import React, { Component } from 'react';
import $ from 'jquery';
import {lastAPIKey, disc_load, supportedLanguages, languageIndex} from './index.js'
var dataArray = []
var storedData = JSON.parse(sessionStorage.getItem("dataArray"));
var currentLink = 'http://allthemusic.surge.sh/';
var artistName;

const Genres = () => (
  <div id="genres">
	<div className="container genres-container">
		<h1 className="text-center">All Genres</h1>
		 <div id="genres-table" className="text-center">
			 <div className="col-md-4" id="genre-row-0">
			 </div>
			 <div className="col-md-4" id="genre-row-1">
				<img src={disc_load} alt="loader" className="text-center disc-loader"></img>
			 </div>
			 <div className="col-md-4" id="genre-row-2">
			 </div>
		</div>

		<div id="genre-pagination" className="col-md-12 text-center">
		</div>
	</div>
  </div>
)


$(document).ready(function(){
//if ($('#charts').length > 0) {
if ($('#genres').length > 0) {
$.getJSON('https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=' + lastAPIKey + '&format=json', function(response) {
	var topTags = response;
	console.log(topTags);
	var rowAmount = 0;
	var genrePage = 1;
	var countRow = 9;
	var maxPages = Math.round(50 / 27)

	function getGenresPages() { /* Not the best pagination if maxpages is ever over 50, which will probably not be, but note this */
		for (var rowCount = 0; rowCount < 3; rowCount++) {
			const GenresRow = Array.apply(null, Array(countRow)).map((number, i) =>
				<a href={currentLink + "Charts?tag=" + topTags.toptags.tag[(i + rowAmount)].name} className="row-link">{topTags.toptags.tag[(i + rowAmount)].name}</a>
			);

			ReactDOM.render(
				<div>{GenresRow}</div>,
				document.getElementById('genre-row-' + rowCount)
			);



			if (rowAmount >= 36) {
				countRow = 5;
				rowAmount += 9;
			} else {
				rowAmount += 9;
			}

			if (rowCount === 2) {


				function GenrePagination() {
					return (
						<div>
							<button id="btn-1" className="genre-pagination-btn">1</button>
							<button id="btn-2" className="genre-pagination-btn">2</button>
						</div>

					);
				};
				ReactDOM.render(<GenrePagination />, document.getElementById('genre-pagination'));
				$('#btn-' + genrePage).addClass('active-btn');

				$('.genre-pagination-btn').click(function() {
					if ($(this).text() == 2 && genrePage != 2) {
						genrePage = 2;
						getGenresPages();
					} else if ($(this).text() == 1 && genrePage != 1) {
						genrePage = 1;
						rowAmount = 0;
						countRow = 9;
						getGenresPages();
					}
				});


			}
		}
	}

	getGenresPages();
	/* If user clicks 2 then, [i] should = 27, and go up until it hits 50
	if the user then clicks 1, then it should be reset back to 0
	*/




	//<a href="#" className="row-link">Rock</a>
});
}
//}
});

export { Genres }
