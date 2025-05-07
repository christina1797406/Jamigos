const playlists = [
    { name: "Playlist 1", songs: "10 Songs", image: "assets/playlist1.jpg" },
    { name: "Playlist 2", songs: "20 Songs", image: "assets/playlist2.jpg" },
    { name: "Playlist 3", songs: "5 Songs", image: "assets/playlist3.jpg" },
    { name: "Playlist 4", songs: "1 Song", image: "assets/playlist4.jpg" },
  ];

  const container = document.querySelector(".playlists");

  playlists.forEach(pl => {
    const card = document.createElement("div");
    card.className = "playlist-card";
    card.innerHTML = `
      <img src="${pl.image}" alt="${pl.name}">
      <p>${pl.name}</p>
      <small>${pl.songs}</small>
    `;
    container.appendChild(card);
  });
