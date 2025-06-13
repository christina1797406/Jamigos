 function toggleTheme() {
      document.body.classList.toggle('dark-mode');
    }

// mood cards for the mood-playlists and their tags
// stores a mapping between mood names (like "happy", "chill", etc.)
// and arrays of related tags (like "Upbeat", "Relaxing", etc.).
// This is the core data that the program uses to find relevant playlists.
// playlists with the tags will be searched to retrieve songs on for the new playlist of that mood
const moodCards = {
    happy: ['Happy', 'Upbeat', 'Feel Good', 'Cheerful', 'Uplifting', 'Party', 'Summer'],
    chill: ['Chill', 'Indie', 'Soft', 'Mellow', 'Calm', 'Relaxing', 'Acoustic', 'Laid Back'],
    energetic: ['Energetic', 'Fast-paced', 'Upbeat', 'Party', 'Summer', 'EDM', 'Rave', 'Energy'],
    sad: ['Sad', 'Acoustic', 'Piano', 'Slow', 'BreakUp', 'Moody', 'Cry', 'Soft-Rock', 'Unrequited'],
    romantic: ['Romantic', 'Love', 'Ballads', 'Duets', 'Romance', 'Cute', 'R&B', 'Relationship'],
    focus: ['Focus', 'Lo-Fi', 'Lofi', 'Study', 'Relaxing', 'Chill', 'Work', 'Concentrate', 'Classical'],
    confident: ['Confident', 'Confidence', 'Girl Boss', 'Boss', 'Hot', 'Sexy', 'Bad B', 'Baddie'],
    dreamy: ['Dreamy', 'Ethereal', 'Floaty', 'Chill', 'Soft', 'Piano', 'Acoustic'],
    angry: ['Angry', 'Active Rock', 'Metal', 'Rage', 'Hard Rock', 'Pissed', 'Scream', 'Crash out'],
    peaceful: ['Peaceful', 'Piano', 'Acoustic', 'Soft', 'Chill', 'Quiet', 'Calm'],
    adventurous: ['Adventurous', 'Adventure', 'Epic', 'Fantasy', 'Magical', 'Blockbuster'],
    sporty: ['Sporty', 'Sport', 'Pumped', 'Workout', 'Gym', 'Hype', 'Energetic', 'Energy', 'Active'],
    bored: ['Bored', 'Drained', 'Boredom'],
    downbeat: ['Downbeat', 'Soft', 'Sad', 'Chill', 'Heartbreak', 'Acoustic', 'Slow', 'Drained'],
    hyper: ['Hyper', 'Active', 'Energy', 'Energetic', 'Dubstep', 'EDM', 'Rave', 'Club'],
    positive: ['Positive', 'Happy', 'Empowering', 'Feel Good', 'Uplifting', 'Energy'],
};


// Select a specified number of random tags from the moodcard array
function selectRandomTags(tags, count = 3) {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

let selectedMood = null;
let playListCounter = 1;

document.querySelectorAll('.mood-card').forEach(function(card){
    card.addEventListener('click', () => {
        document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
         card.classList.add('selected');
         selectedMood = card.innerText.trim();
         console.log("Selected mood:", selectedMood);
    });
});



function clearMoodSelection() {
  document.querySelectorAll('.mood-card').forEach(card => card.classList.remove('selected'));
  selectedMood = null;
}

function createPlaylistBox() {
  const container = document.getElementById('playlistModal');

  const box = document.createElement('div');
  box.className = 'playlist-box';

  const title = document.createElement('input');
  title.type = 'text';
  title.className = 'playlist-title';
  title.value = `Playlist ${playlistCounter++}`;

  const songList = document.createElement('div');
  songList.className = 'song-list';
  songList.innerHTML = "<p>(Songs will appear here)</p>";

  box.appendChild(title);
  box.appendChild(songList);
  container.appendChild(box);
}

document.getElementById('generatePlaylist').addEventListener('click', () => {
  if (!selectedMood) {
    alert("Please select a mood first.");
    return;
  }

  createPlaylistBox();
  clearMoodSelection();
});

/*
// Helper: Search playlists by keyword (returns a Promise)
function searchPlaylistsByKeyword(keyword, limit = 5) {
    //  Corrected Spotify API endpoint for searching playlists
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(keyword)}&type=playlist&limit=${limit}`;
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`, //  Use the accessToken variable
            'Content-Type': 'application/json'  // Add content type
        }
    }).then(res => {
        if (!res.ok) {
            //  Improved error handling: include status code and message
            throw new Error(`Spotify API error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
    }).then(data => {
        //  Check if playlists property exists
        if (!data.playlists) {
            console.error('Error: Playlists property is missing from the response:', data);
            return []; // Return empty array to avoid crashing
        }
        return data.playlists.items;
    }).catch(error => {
        console.error('Error searching playlists:', error);
        //  Important: re-throw the error so it can be handled by the caller
        throw error;
    });
}

// Helper: Get tracks from a playlist by ID (returns a Promise)
function getTracksFromPlaylist(playlistId, limit = 15) {
    // Corrected Spotify API endpoint for getting playlist tracks
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`;
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,  // Use the accessToken variable
            'Content-Type': 'application/json' // Add content type
        }
    }).then(res => {
        if (!res.ok) {
             // Improved error handling
            throw new Error(`Spotify API error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
    }).then(data => {
        // Extract track URIs (some tracks can be null, so filter them)
        if (!data.items) {
            console.error('Error: items property is missing from the response:', data);
            return [];
        }
        return data.items
            .map(item => item.track && item.track.uri)
            .filter(uri => uri);
    }).catch(error => {
        console.error('Error fetching tracks:', error);
        throw error; // Re-throw
    });
}

/**
 * Extracts track information from a playlist object.
 * @param {any} playlist - The playlist object from the Spotify API.
 * @returns {any[]} An array of track objects, or an empty array if the playlist is invalid.
 */

/*
function extractTracks(playlist) {
    if (!Array.isArray(playlist)) {
        console.warn(`Invalid playlist data. Expected an array, got:`, playlist);
        return [];
    }
    return playlist.flatMap(item => {
        // Check for item and item.track, and handle the artists array
        if (item?.track) {
            const track = item.track;
            const artists = track.artists ? track.artists.map(artist => artist.name).join(', ') : '';
            return {
                id: track.id,
                name: track.name,
                artist: artists, // Use the formatted artists string
                uri: track.uri,
            };
        }
        return [];
    });
}

// Generate playlist tracks for selected mood (using Promises)
function generatePlaylistTracksByMoodTags(selectedMood) {
    const tags = moodCards[selectedMood];
    if (!tags) {
        return Promise.reject(`No tags found for mood "${selectedMood}"`);
    }

    const randomTags = selectRandomTags(tags, 3);
    console.log(`Selected tags for mood "${selectedMood}":`, randomTags);

    let allTrackUris = [];

    // We'll chain promises for each tag and accumulate tracks
    let chain = Promise.resolve();

    randomTags.forEach(tag => {
        chain = chain
            .then(() => searchPlaylistsByKeyword(tag, 3))
            .then(playlists => {
                // For each playlist, get tracks (return Promise.all)
                const trackPromises = playlists.map(pl => getTracksFromPlaylist(pl.id, 15));
                return Promise.all(trackPromises);
            })
            .then(tracksArrays => {
                tracksArrays.forEach(tracks => {
                    allTrackUris = allTrackUris.concat(tracks);
                });
            });
    });

    return chain.then(() => {
        // Remove duplicates
        const uniqueUris = [...new Set(allTrackUris)];
        return uniqueUris;
    });
}

/**
 * Displays the generated playlist in the UI.
 * @param {string[]} trackUris - An array of track URIs.
 */

/*
function displayPlaylist(trackUris) {
    const playlistContainer = document.getElementById('generatedPlaylist');
    if (!playlistContainer) {
        console.error('Playlist container element not found.');
        return;
    }
    playlistContainer.innerHTML = '';

    if (trackUris.length === 0) {
        playlistContainer.textContent = 'No songs found for the selected moods.';
        return;
    }

    const heading = document.createElement('h2');
    heading.textContent = "Generated Playlist";
    playlistContainer.appendChild(heading);

    const list = document.createElement('ul');
    trackUris.forEach(uri => {
        const listItem = document.createElement('li');
        listItem.textContent = uri; //  Display track URI
		const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-track-button');  // Add a class for styling
        removeButton.dataset.uri = uri; // Store the track URI
		listItem.appendChild(removeButton);
        list.appendChild(listItem);
    });
    playlistContainer.appendChild(list);

	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('playlist-actions');

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Playlist';
    saveButton.id = 'savePlaylist';
    buttonContainer.appendChild(saveButton);


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Playlist';
    deleteButton.id = 'deletePlaylist';
    buttonContainer.appendChild(deleteButton);

	playlistContainer.appendChild(buttonContainer);
    const generatePlaylistButton = document.getElementById('generatePlaylist');
    if (generatePlaylistButton) {
        generatePlaylistButton.insertAdjacentElement("afterend", playlistContainer);
    }
}



// 5. Event Listeners
// ------------------

// Event listener for mood card clicks to toggle selection
document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const span = card.querySelector('span');
        selectedMood = span ? span.innerText.trim().toLowerCase() : null;
        console.log(`Mood selected: ${selectedMood}`);
    });
});

// Event listener for the "Generate Playlist" button
document.getElementById('generatePlaylist').addEventListener('click', () => {
    if (!selectedMood) {
        alert('Please select a mood first!');
        return;
    }

    generatePlaylistTracksByMoodTags(selectedMood)
        .then(trackUris => {
            console.log('Generated track URIs:', trackUris);
            alert(`Found ${trackUris.length} unique tracks for mood "${selectedMood}".  Check the console for track URIs.`);
            displayPlaylist(trackUris);  // Call displayPlaylist with track URIs
        })
        .catch(err => {
            console.error(err);
            alert(`Error: ${err}`);
        });
});

// Event listener for dynamically added remove buttons
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-track-button')) {
    const trackUriToRemove = event.target.dataset.uri;
    const listItem = event.target.closest('li');
    if (listItem) {
      listItem.remove(); // Remove the <li> element
      // Remove the track from the displayed list.
	  console.log(`Removed track ${trackUriToRemove}`)
    }
  }
});

// Event listener for the Save Playlist button (requires Spotify API call)
document.getElementById('savePlaylist').addEventListener('click', () => {
    //  Add logic to save the playlist to the user's Spotify account
    if (!selectedMood) {
      alert('Please select a mood and generate a playlist first.');
      return;
    }
	alert(`Saving playlist for ${selectedMood}.  This functionality needs to be implemented to call the Spotify API`);
    console.log(`Saving playlist for mood: ${selectedMood}`);
    //  Spotify API endpoint: POST /users/{user_id}/playlists
    //  with the track URIs in the request body
});

// Event listener for the Delete Playlist button
document.getElementById('deletePlaylist').addEventListener('click', () => {
    // Add logic to delete the generated playlist
	alert('Deleting playlist.  This functionality needs to be implemented.');
    console.log('Deleting playlist');
    const playlistContainer = document.getElementById('generatedPlaylist');
    if (playlistContainer) {
      playlistContainer.innerHTML = ''; // Clear the playlist display
    }
    selectedMood = null; // Reset
});

*/
