import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './Navbar.css';
import {Home} from './Home.js';
import lastfm_image from './lastfm_image.png';
import seatgeek_image from './seatgeek_image.png';
import musicbrainz_image from './musicbrainz_image.png';
import four_oh_four from './vinyl_animation.gif';
import main_logo from './disc_logo.png';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

var currentLink = 'https://tylerjdev.github.io/Music-Artist-Lookup/'

const NavBar = () => (
  <Router>
  <div id="main-body-of">
  <div className="container-fluid">
  <div className="nav-con col-md-12">
    <div className="navbar-header col-md-3">
	  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
	  <ul className="nav navbar-nav">
		  <li className="nav-brand"><a href={currentLink}><img src={main_logo} id="disc-logo"></img>MUSIC</a></li>
		</ul>
    </div>
		<div className="collapse navbar-collapse col-md-offset-1 col-md-5" id="myNavbar">
			<ul id="nav-listings" className="nav navbar-nav">
			  <li><a href={currentLink}>HOME</a></li>
			  <li><a href={currentLink + "Charts"}>CHARTS</a></li>
			  <li><a href={currentLink +"Profile"}>PROFILE</a></li>
			  <li><a href={currentLink + "About"}>ABOUT</a></li>
			</ul>
		</div>	
		<form id="input-form" className="navbar-form navbar-right input-form col-md-3">
			<div className="form-group">
				<input id="input-search" type="text" className="form-control input-search" placeholder="Search for artists, albums or tracks"></input>
				<i className="fa fa-search" aria-hidden="true"></i>
			</div>
		</form>
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
	<Route path="/Charts" component={FourOhFour}/>
	<Route path="/Profile" component={FourOhFour}/>
	<Route path="/About" component={About}/>
	</div>
 </Router>
)

const About = () => (
	<div>
		<div id="jumbotron-about" className="jumbotron">
			<div id="jumbo-text" className="text-center">
			  <h1 className="display-3">About the site</h1>
			  <p className="lead">And the person that made it</p>
			</div>
		</div>
		
		<div id="about-con" className="container">
			<h1>About the site</h1>
			<div className="col-md-12">
				<div className="col-md-6">
					<p>The idea of this site was to allow easy access to your favorite artists, albums and tracks. With the help of Last.FM, and other APIs, I was allowed to fully expand on this idea.</p>
				</div>
			</div>
			
			<h1>Credits</h1>
			<div className="col-md-12">
				<p>Resources and APIs used,</p>
				<a href="https://www.last.fm/"><img src={lastfm_image} alt="Last.FM" height="60" width="200" className="logo-brand"></img></a>
				<a href="https://seatgeek.com/"><img src={seatgeek_image} alt="SeatGeek" height="60" width="290" className="logo-brand"></img></a>
				<a href="https://musicbrainz.org/"><img src={musicbrainz_image} alt="MusicBrainz" height="60" width="250" className="logo-brand"></img></a>
				<p>Pictures provided by <a href="https://unsplash.com/">Unsplash</a>.<br></br>
				
				Artist credits, <a href="https://unsplash.com/@minkmingle">Mink Mingle</a>, <a href="https://unsplash.com/@yvettedewit">Yvette de Wit</a></p>
			</div>
		</div>
  </div>
)

/* const Charts = () => (
  <div id="four-oh-four" className="text-center">
    <img src={four_oh_four} id="404-image"></img>
	<h2 id="404-header">404<br></br>
	PAGE NOT FOUND</h2>
  </div>
)

const Profile = () => (
  <div>
    <h2>Profile</h2>
  </div>
) */

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

	<div id="main-con" className="container-fluid">
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
export { NavBar, Pages, MainIndex}

//ReactDOM.render(<BasicExample />, document.getElementById('root'));
