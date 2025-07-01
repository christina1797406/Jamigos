 function toggleTheme(){
    document.body.classList.toggle('dark-mode');
  }

  let selectedMood = null;
  let songs = [];
  let playlistCount = 1;
  const moodSelection = document.querySelectorAll('.mood-card');
  moodSelection.forEach(function(moodCard){
    moodCard.addEventListener('click', function(){
        moodSelection.forEach(function(c){
            c.classList.remove('selected');
        });
        moodCard.classList.add('selected');
        selectedMood = moodCard.getAttribute('data-mood');
    });
  });

  function showSongs(){
    const songList = document.getElementById('songList');
    songList.innerHTML = "";
    if(songs.length === 0){
        songList.innerHTML = "<p>No songs in this playlist.</p>";
        return;
    }
    songs.forEach((song, index) => {
        const albumHTML = song.albumCover ? `<img src = "${song.albumCover}" alt="Album cover"` : '';
        const songItem = document.createElement("div");
        songItem.innerHTML = `
            ${albumCover}
            <div class "song-info">
                <div class = "song-title">${song.title}</div>
                <div class = song-artist">${song.artist}</div>
            </div>
            <button type = button class "remove">-</button>
        `;
        songItem.querySelector('.remove').onclick = () => {
            songs.splice(index, 1);
            showSongs();
        };
        songList.appendChild(songItem);
    });
  }

  async function generatePlaylist(count = 10, append = false){
    if(!selectedMood){
        alert("Please select mood first.");
        return;
    }
    try {
        const res = await fetch(`/api/mood-playlist?mood=${selectedMood}`);
        if(!res.ok){
            throw new Error("Failed to fetch playlist");
        }
        const newSongs = await res.json();
        if(!append){
            songs = newSongs;
            document.getElementById('playlistTitle').value = `Playlist ${playlistCount}`;
        }else{
            songs.push(...newSongs);
        }
        showSongs();
        document.getElementById('playlistModal').style.display = "flex";
    } catch (err){
        console.error(err);
        alert('Oops, something went wrong. Please try again.');
    }
  }
//when the button for closePlaylist is clicked then the preview of the playlist becomes hidden
function closePlaylist(){
  document.getElementById('playlistModal').style.display = "none";
}
document.getElementById('savePlaylistBtn').onclick = function(){
    const title = document.getElementById('playlistTitle').value.trim();
    if(!title){
        alert("Please enter playlist name");
        return;
    }
    alert(`${title} saved!`);
    closePlaylist();
    playlistCount++;
};
//when users press the more songs button, 10 more songs are appended on to the playlist

document.getElementById("moreSongsBtn").onclick = function(){
  generatePlaylist(10, true);
};





