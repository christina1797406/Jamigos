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

/* Everything DOM-dependent should go inside this block */
document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const fileInput = document.getElementById("avatarInput");

  // Auto generate initials
  const username = "User123";
  const initials = username[0].toUpperCase();
  avatar.querySelector("span").textContent = initials;

  // Load profile image
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        avatar.style.backgroundImage = `url('${reader.result}')`;
        avatar.querySelector("span").style.display = "none"; // Hide initials
      };
      reader.readAsDataURL(file);
    }
  });

  // Click avatar to open file picker
  avatar.addEventListener("click", () => fileInput.click());
});
