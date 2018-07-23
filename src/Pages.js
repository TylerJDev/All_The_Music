import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './Navbar.css';
import {Home} from './Home.js';
import {Charts} from './Charts.js';
import {Genres} from './Genres.js';
import lastfm_image from './lastfm_image.png';
import seatgeek_image from './seatgeek_image.png';
import musicbrainz_image from './musicbrainz_image.png';
import four_oh_four from './vinyl_animation.gif';
import disc_load from './disc_load.png';
import main_logo from './disc_logo.png';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

var currentLink = 'http://allthemusic.surge.sh/' // 'https://tylerjdev.github.io/'

const NavBar = () => (
  <Router>
  <div id="main-body-of">
  <div className="container-fluid">
  <div className="nav-con col-md-12">
    <div className="navbar-header col-sm-3 col-md-3">
	  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
	  <ul className="nav navbar-nav">
		  <li className="nav-brand"><a href={currentLink}><img src={main_logo} id="disc-logo"></img>MUSIC</a></li>
		</ul>
    </div>
		<div className="collapse navbar-collapse col-sm-6 col-md-6" id="myNavbar">
			<ul id="nav-listings" className="nav navbar-nav">
			  <li><a href={currentLink}>HOME</a></li>
			  <li><a href={currentLink + "Charts"}>CHARTS</a></li>
			  <li><a href={currentLink +"Genres"}>GENRES</a></li>
			  <li><a href={currentLink + "About"}>ABOUT</a></li>
			</ul>
		</div>
		<div className="col-sm-3 col-md-3">
			<form id="input-form" className="navbar-form navbar-right input-form">
				<div className="form-group">
					<input id="input-search" type="text" className="form-control input-search" placeholder="Search for artists, albums or tracks"></input>
					<button className="btn_search"><i id="btn-search" className="fa fa-search" aria-hidden="true"></i></button>
				</div>
			</form>
		</div>
	</div>

  </div>
	<div id="index-of"></div>
  </div>
  </Router>
)

const Pages = () => (
 <Router>
	<div>
  	<Route exact path="/" component={Home}/>
	  <Route path="/Charts" component={Charts}/>
	  <Route path="/Genres" component={Genres}/>
	  <Route path="/About" component={About}/>
    <Route path="/404" component={FourOhFour}/>
	</div>
 </Router>
)

const About = () => (
	<div>
		<div id="jumbotron-about" className="jumbotron">
			<div id="jumbo-text" className="text-center">
			  <h1 className="display-3">About</h1>
			</div>
		</div>

		<div id="about-con" className="container">
			<h2 className="text-center">About All The Music</h2>
			<div className="col-md-12">
				<div className="col-md-8">
					<p><span style={{fontSize: '4rem', fontFamily: 'Abel'}}>All The Music</span> is a website that connects you to different artists, albums and tracks. Look for your favorite artists, get details for future venues and get connected via social media! <br/><br/> The idea that created this website was to allow users easy access to favorite artists, albums and tracks. With the help of Last.FM, MusicBrainz and SeatGeek I was allowed to fully implement that idea.</p>
				</div>
        <div id="disc_side" className="col-md-4">
          <img src={disc_load} alt="loader" className="text-center disc-loader"></img>
        </div>
			</div>


      <div id="four_con" className="col-md-12">
        <div className="col-md-3">
          <img src={four_oh_four} alt="loader" className="text-center four_oh" style={{transform: 'rotate(0deg)'}}></img>
        </div>
        <div className="col-md-3">
          <img src={four_oh_four} alt="loader" className="text-center four_oh" style={{transform: 'rotate(90deg)'}}></img>
        </div>
        <div className="col-md-3">
          <img src={four_oh_four} alt="loader" className="text-center four_oh" style={{transform: 'rotate(180deg)'}}></img>
        </div>
        <div className="col-md-3">
          <img src={four_oh_four} alt="loader" className="text-center four_oh" style={{transform: 'rotate(270deg)'}}></img>
        </div>
      </div>

      <div id="contact_me" className="col-md-12 text-center">
        <h2>Need to get in touch with me?</h2>
        <h3><a href="https://twitter.com/TyJDev" target="_blank" style={{textDecoration: 'none', color: 'black'}}><i className="fa fa-twitter contact-icon" aria-hidden="true"></i> TyJDev</a></h3>
        <h3><i className="fa fa-envelope contact-icon"></i> tylerjdev@gmail.com</h3>
      </div>


      <div id="credit_section" className="text-center">
  			<h2>Credits</h2>
  			<div className="col-md-12" style={{marginBottom: '50px'}}>
  				<a href="https://www.last.fm/"><img src={lastfm_image} alt="Last.FM" height="60" width="200" className="logo-brand"></img></a>
  				<a href="https://seatgeek.com/"><img src={seatgeek_image} alt="SeatGeek" height="50" width="250" className="logo-brand"></img></a>
  				<a href="https://musicbrainz.org/"><img src={musicbrainz_image} alt="MusicBrainz" height="60" width="250" className="logo-brand"></img></a>
  				<p>Pictures provided by <a href="https://unsplash.com/">Unsplash</a>.<br></br>

  				Picture credits, <a href="https://unsplash.com/@minkmingle">Mink Mingle</a>, <a href="https://unsplash.com/@yvettedewit">Yvette de Wit</a></p>
  			</div>
      </div>
		</div>
  </div>
)

/* const Charts = () => (
  <div id="charts-page">

  </div>
) */

// const Profile = () => (
//   <div>
//     <h2>Profile</h2>
//   </div>
// )

const FourOhFour = () => (
  <div id="four-oh-four" className="text-center">
    <img src={four_oh_four} id="404-image"></img>
	<h2 id="404-header">404<br></br>
	PAGE NOT FOUND</h2>
  </div>
)

function MainIndex() {
	return (
	<div id="main-index">
			<div id="main-header" className="container-fluid">
		<div id="bg-con">
		<div id="photo-con" className="col-xs-12 col-sm-4 col-md-2">
			<div id="main-photo">
			</div>
		</div>

		<div id="header-details" className="col-xs-12 col-sm-offset-1 col-sm-7 col-md-9">
			<div id="main-header-con" className="col-md-12">
			</div>
		</div>


		</div>
	</div>

	<div id="main-con" className="container-fluid main-container">
		<div id="main-row" className="row">
			<div id="main-sidebar" className="col-xs-12 col-md-3">
			</div>
			<div id="main-body" className="col-xs-12 col-md-9">
				<div id="navTabs" className="col-md-12">
				</div>

				<div id="tab-container" className="tab-content">
					<div className="tab-pane active" id="main" role="tabpanel">
						<div id="video-section">
						</div>

						<div id="bio-section">
						</div>

						<div id="songs-section">
						</div>

						<div id="album-songs-section">
						</div>

						<div id="events-section">
						</div>

						<div id="similar-section">
						</div>
					</div>

					<div className="tab-pane" id="photos" role="tabpanel">
					</div>

					<div className="tab-pane" id="bio-detail" role="tabpanel">
					</div>

					<div className="tab-pane" id="albums-songs-tab" role="tabpanel">
					</div>
				</div>


			</div>


		</div>
	</div>
		</div>
	);
}
export { NavBar, Pages, MainIndex }

//ReactDOM.render(<BasicExample />, document.getElementById('root'));
