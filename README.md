# Randify-backend

refresh the page for a new song! 

Example |
------- |
![randomSong](https://randify-backend.herokuapp.com/svg-s) |
refresh the page for a new song!  

**Randify-backend**
----
   Fetch a random song with Randify! 

* **URL**

  /random

* **Method:**
  
  `GET`
  
* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `{"album_name":"random song","album_image":{"height":300,"url":"https://linkToPublicImage","width":300},"track_artist":"Hozier","track_name":"Almost (Sweet Music)","preview_url":"nullOrhttps://linkToPublicSongPreview","spotify_url":"https://OpenSpotify","is_explicit":true,"attempts":5}%`
 
* **Error Response:**

  Most likely going to give 404 if any error due to heroku not spinning up fast enough

  * **Code:** 404 page not found <br />
    **Content:** `<h1>Page Not Found (404) </h1> <h2> Available Routes: </h2> <ul><li key=0> <a href="/"> <p>/: Home Page </p> </a> </li><li key=1> <a href="/login"> <p>/login: login route using Spotify 20Auth </p> </a> </li><li key=2> <a href="/random"> <p>/random: generates random song </p> </a> </li><li key=3> <a href="/markdown"> <p>/markdown: generates markdown complient svg of random song </p> </a> </li><li key=4> <a href="/svg-s"> <p>/svg-s: generates small svg of a random song </p> </a> </li><li key=5> <a href="/svg-m"> <p>/svg-m: generates medium svg of a random song </p> </a> </li><li key=6> <a href="/svg-l"> <p>/svg-l: generates large svg of a random song </p> </a> </li></ul>`

* **Sample Call:**

  `curl https://randify-backend.herokuapp.com/random`

  OR

  ```javascript
    fetch('https://randify-backend.herokuapp.com/random')
    .then(response => ...);
  ```

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._>

backend can be found at : https://randify-backend.herokuapp.com/
