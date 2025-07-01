/* eslint-disable no-unused-vars */

// function toggles light and dark mode on and off
// when toggle theme button is pressed (via an onlick event)
 function toggleTheme(){
    document.body.classList.toggle('dark-mode');
  }

  let selectedMood = null;
  // initalises an empty song array that will hold song data
  let songs = [];
  // sets the playlist count to 1 instead of 0 as the first playlist the user created should have
  // a value of 1 signalling that it is their first playlist
  // the playlist count will increment everytime they save a new playlist
  let playlistCount = 1;
  // selects all the elements with the class mood-card
  const moodSelection = document.querySelectorAll('.mood-card');
  // adds a click event listener to all of the mood-cards
  moodSelection.forEach(function(moodCard){
    moodCard.addEventListener('click', function(){
        // removes the selected class from the mood cards
        // making sure all mood cards are deselected
        moodSelection.forEach(function(deselect){
            deselect.classList.remove('selected');
        });
        // adds the selected class to the mood card that was clicked on
        // the selected class puts a purple border around the card via css
        moodCard.classList.add('selected');
        // updates selectedMood to contain the mood of the clicked moodcard
        selectedMood = moodCard.getAttribute('data-mood');
    });
  });

  function showSongs(){
    const songList = document.getElementById('songList');
    songList.innerHTML = "";
    // if there are no songs in the songs array then display the <p> "No songs in this playlist"
    // and stop the function signalling to the user that the playlist is empty
    // this <p> is usually displayed when the user has removed all the songs from the playlist
    // or if an error happened when retrieving the songs from spotify (happend a lot during testing)
    if(songs.length === 0){
        songList.innerHTML = "<p>No songs in this playlist.</p>";
        return;
    }

    // the following code applies to each song in the songs array
    // each song will have a div called songItem in the preview playlist
    // which will display a an album cover for the song, the title and artist of the song
    // wanted it to also display a 30 second preview of the song but spotify got rid of the endpoint
    // each songItem div will also have a remove button
    // so that the user can remove any song from the playlist if they don't like it
    // albumCover, title and artist were established as song object members in the backend
    // and were sent to the frontend via JSON response
    songs.forEach((song, index) => {
        const songItem = document.createElement("div");
        songItem.innerHTML = `
            <img src = "${song.albumCover}" alt = "Album cover">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <small class="song-artist">${song.artist}</small>
            </div>
            <button type="button" class="remove">-</button>
        `;

        // function removes song from the playlist
        const removeBtn = songItem.querySelector('.remove');
        removeBtn.addEventListener('click', function(){
            // removes the song (1 item) from the song at the current index
            songs.splice(index, 1);
            // re-rendering the song list (by calling the function again) updates the UI
            // to remove the song that was removed from the songs array
            showSongs();
        });
        // appends the songItem element to the end of the list
        songList.appendChild(songItem);
    });
  }

  // this function is executed when the generate playlist button is pressed
  // it essentially retrieves random playlists from spotify matching the selected mood
  // and from those playlists it retrives random songs from the playlists
  // and adds them to this newly generated playlist which is then shown on the screen via showSongs
  // it shows 20 songs
  async function generatePlaylist(count = 20, append = false){
    // if the user fails to select a mood before pressing generate playlist
    // it displays an alert message asking the user to select a mood first and exits the function
    if(!selectedMood){
        alert("Please select mood first.");
        return;
    }
    try {
        // sends a GET request to the spotify endpoint established in the backend (spotify.js)
        // with selected mood acting as the query paramater
        // The backend will then call spotify api and return a list of songs based on the mood
        const res = await fetch(`/api/mood-playlist?mood=${selectedMood}&count=${count}`);
        const newSongs = await res.json();
        if(!append){
            // if a new playlist is being generated (not appending)
            // replace the songs in the current playlist with new songs as it is a new playlist
            songs = newSongs;
            // sets a new playlist title in the input field (the current playlist count)
            // users will be able to edit it to create their own playlist title
            document.getElementById('playlistTitle').value = `Playlist ${playlistCount}`;
        }else{
            // merges the array of new songs into the pre existing song array (at the end)
            songs.push(...newSongs);
        }
        // shows the preview playlist and calls the showSongs function to display the playlist songs
        document.getElementById('playlistModal').style.display = "flex";
        showSongs();
    // if an error happens when fetching the playlists an error message is displayed on the console
    // and user is alerted that something went wrong
    // helped a lot during testing
    } catch (err){
        console.error(err);
        alert('Oops, something went wrong. Please try again.');
    }
  }

// when the button for closePlaylist is clicked then the preview of the playlist becomes hidden
function closePlaylist(){
  document.getElementById('playlistModal').style.display = "none";
}

// function saves the playlist to the database so that users can revist it
// (still need to add code for that)
function savePlaylist(){
    const title = document.getElementById('playlistTitle').value.trim();
    // if the input text field used for the playlist title is empty
    // then alert the user that they need to name the playlist in order to save it
    // and stop the function
    if(title === " " || title === null){
        alert("Please enter playlist name");
        return;
    }
    // alerts user that their playlist has been saved
    alert(`${title} saved!`);
    // calls closePlaylist function that closes the playlist preview window
    closePlaylist();
    // increments the playlist count by 1
    // I chose for the save function to increment the playlist instead of generate playlist function
    // as not all the playlists the users create will go to their database as an official playlist
    // since users can choose to close a playlist instead of save it if they don't like it
    playlistCount++;
}

// when users press the more songs button, 10 more songs are appended on to the playlist
// currently this function doesn't work properly as it adds the same 10 songs to the playlist
// i need to randomise it
document.getElementById("moreSongsBtn").onclick = function(){
    // calls generate playlist function taking in count = 10, append = true as it's parameters
    // this adds 10 songs to the playlist
    generatePlaylist(10, true);
};





