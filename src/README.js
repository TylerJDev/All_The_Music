//Song Artist Lookup Website\\

// -- Pages

Home page, a static page, due to it not having many moving parts * Important
About page, another static page, for the same reasons as the home page * Important
Profile page,
'Charts' page,

// -- TODO
!! Finish track 'page', fix this error http://localhost:3000/src/index.html?query=L%27Orange&track=Need%20You%20(feat.%20Blu)&type=track (caused because the track name includes words that the track on the album does not have!! &&&& DON'T FORGET TO PUT BACK LOCALHOST LINK ON SEARCH.JS (Don't forget to reply to New zealand pal btw)

Add something for songs (to look up, have their own page?)
Rework site for mobile display (Like albums on artist page)
Add more comments to the code
Add localstorage to artists pages (album tab)
Finish Pages section

// -- TODO (FINISHED)
Add something better then 'No description listed' for an album without a wiki, possibly a way to add your own summary (Via last.fm API)
Change the color of the 'meta-data' in the header (i.e, albums, listeners)
Add a way to go back to artist page from the album page
Add 'active' class on tab, (search tabs)
Add something, or remove the 'albums' in the header section
Add way to search for albums, tracks
If song length if 0:00, add 'not listed' instead (for album pages)
Add question mark for similar artists, if they don't have an image, example: (http://localhost:3000/src/index.html?query=Sekuoia&type=artist) ('Molife')
Find way to extend the search call from 12, to a high amount (to do less calls) and pull data from array(?)
Make sure if the user has already called data (i.e, searched for artists, then clicks tracks, then goes back to artist) to save the calls
Change images to lower quality, and ensure site is using all ways to use less data
Fix where the search skips 16 results
Possibly add commas for numbers (i.e listeners: 500,000 instead of 500000)
Add way for 'read more' btns on artists page to go to their correct tab
Have 'view more' btn (under albums) to go to that tab
Fix margin/sizing with youtube display in smaller displays example: (http://localhost:3000/src/index.html?query=The+Pharcyde&type=artist) // Test a smaller display to see
Add (front page) to localstorage
Change logo
/Fix where main page might put top artists in top tracks section (Refresh 3~ times on main page)
/Change character limit on search section (artists) (i.e, search Do not fire! Madvillain, go to tracks, see track 'do a couple of things')
/On 'read more' btn click, scroll down to the section
/Find the perfect margin for 'the meta-data-header' (i.e, listeners, albums), example: (http://localhost:3000/src/index.html?query=Boom%20Clap%20Bachelors&type=artist) // Not needed, since visible at all margins
/Add so if you click a different tab (i.e, 'tracks', then click back to 'artists', it'll save the page you were on // Did not add this, seems like it's better just to keep it as it is

/* -- Errors */
// > Artist's pages that display errors;
- http://localhost:3000/src/index.html?query=%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%CC%81%D0%B9+%D0%A0%D1%8B%CC%81%D0%B1%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2&type=artist
- Blu & Exile > http://localhost:3000/src/index.html?query=Blu+&+Exile&type=artist
- Gorillaz > http://localhost:3000/src/index.html?query=Blu+&+Exile&type=artist
- Search something twice (quickly), (i.e 'blu'), then click tracks, should get an error
- http://localhost:3000/src/index.html?query=Mikael%20Tariverdiev&type=artist > Why is there a 'read more' link still?
- Some albums don't load, (i.e, 'flowers while I can still smell them') <<<< Possibly add MusicBrainz as alt if can't figure out what's causing this error
- http://localhost:3000/src/index.html?query=Blu+&+Madlib&type=artist
- http://localhost:3000/src/index.html?query=Madlib&type=artist Or probably any other artist, if you click the album-songs tab too fast, it will display an error, probably because it tries to 'render' before it has the data ready via the api (?)

(Might be the same as the above)

- http://localhost:3000/src/index.html?query=Gorillaz+vs.+Blondie&type=artist

// -- TO DO (Later)
Make sure MusicBrainz gets the correct artist
Figure out proper attribution, (i.e, glyphicons, logos, apis, etc.)
Possibly add color to the 'Available on' links when the link is hovered via the keyboard (i.e, tab)
Go back to seatgeek function call, and make sure everything is complete (i.e, make sure if there are more than '1' artist(s) at the last level, to properly handle them
Make sure to save data whenever it can be saved
/Only use one youtube if MusicBrainz has multiple youtube links, example : (http://localhost:3000/src/index.html?query=Blur&type=artist)\
Condense the search results to have less pages
Integrate last.fm user capabilities into site
Add something to prevent multiple calls when searching (If you press enter multiple times) [Already done, but could possibly be improved]
Change Albums & songs to just Albums
Finish 'photos' tab
Create Contact page
Change favicon

// -- Responsive Design > TODO
Add burger menu, or way to select navbar links on smaller display
Fix youtube video display for lower display
Fix results marging/spacing issue on lower displays

