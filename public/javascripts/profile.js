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

document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const fileInput = document.getElementById("avatarInput");
  const avatarSpan = avatar.querySelector("span");

  const usernameEl = document.querySelector(".user-info h2");
  const emailEl = document.querySelector(".user-info p");

  // Auto-generate initials
  const initials = usernameEl.textContent[0].toUpperCase();
  avatarSpan.textContent = initials;

  // Avatar click opens file input
  avatar.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        avatar.style.backgroundImage = `url('${reader.result}')`;
        avatarSpan.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Edit Profile Modal
  const editBtn = document.querySelector(".profile-actions button");
  const modal = document.getElementById("editModal");
  const form = document.getElementById("editForm");
  const cancelBtn = document.getElementById("cancelEdit");

  editBtn.addEventListener("click", () => {
    document.getElementById("editUsername").value = usernameEl.textContent;
    document.getElementById("editEmail").value = emailEl.textContent;
    modal.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUsername = document.getElementById("editUsername").value;
    const newEmail = document.getElementById("editEmail").value;
    const pic = document.getElementById("editProfilePic").files[0];

    const formData = {
      username: newUsername,
      email: newEmail
    };

    const sendData = async (data) => {
      try {
        const res = await fetch("/profile-pic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          usernameEl.textContent = newUsername;
          emailEl.textContent = newEmail;
          modal.style.display = "none";
        }
      } catch (err) {
        // handle error silently
      }
    };

    if (pic && pic.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        formData.image = reader.result;
        avatar.style.backgroundImage = `url('${reader.result}')`;
        avatarSpan.style.display = "none";
        sendData(formData);
      };
      reader.readAsDataURL(pic);
    } else {
      sendData(formData);
    }
  });
});
