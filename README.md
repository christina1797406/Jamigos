# 🎵 Jamigos

**Jamigos** is a social music web application designed to help users discover and enjoy music tailored to their mood and preferences. It integrates with the [Spotify Web API](https://developer.spotify.com/documentation/web-api) to dynamically generate playlists, allows light/dark mode toggling, and includes social sharing features to enhance the user experience. It also uses the [Google OAuth API](https://developers.google.com/identity/protocols/oauth2) to allow users to easily register with their Google accounts.

To access the full-feature implementation, please switch to the `dev` branch, where all major updates and features have been merged.

📹 **View 8-minute presentation video:** https://youtu.be/ul-9M7I4j_8

---

## ⚙️ Setup Instructions

### 🧰 Prerequisites

Ensure the following tools and services are installed and configured on your machine:

- **Node.js** (v14 or higher recommended)
- **MySQL Server**
- **Spotify Developer Account** (for access tokens and client credentials)
- **Google Cloud Project** with OAuth 2.0 credentials for Google login

---

### 🛠️ Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/jamigos.git
   cd jamigos
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install express mysql2 bcrypt dotenv morgan cors axios express-session google-auth-library spotify-web-api-node
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and define the following:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   SESSION_SECRET=your_secure_session_secret
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_db_password
   DB_NAME=jamigos_db
   ```

4. **Configure MySQL Database**

   Create a new database called `jamigos_db` and run the SQL migration scripts found in the `sql/` directory to initialise the schema for:

   - Users
   - Playlists
   - Mood logs (if implemented)

5. **Start the App**

   ```bash
   npm start
   ```

6. **Open in Browser**

   Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Features and Functionality

### 🔐 User Authentication
- Google OAuth 2.0 login system
- Secure session management using `express-session`

### 🎼 Mood-Based Playlist Generation
- Users can select a mood
- The app generates a curated playlist from Spotify in real-time

### 🌗 Light/Dark Mode Toggle
- Intuitive UI with theme-switching capability
- Preference is stored in browser local storage

### 📊 User Dashboard
- View recent playlists, trending tracks, and friend activity
- Integration with Spotify for real-time content

### 👤 Account Management
User profiles with:
- Unique usernames and emails
- Securely hashed passwords (via `bcrypt`)
- Profile picture uploads (with file size/type restrictions)
- Timestamps for account creation

### 📁 Playlist Storage
- Playlists are saved to the user’s account
- Previously generated playlists are accessible upon login

---

## 🐛 Known Bugs or Limitations

### 🎵 Mood Filtering
Some moods may return limited or irrelevant results due to Spotify API limitations.

### ⏱️ Delayed Playlist Responses
Playlist generation may be slower during high traffic or rate limits.

### 🌓 Light/Dark Mode Persistence
Theme preference is not yet saved across sessions or devices.

### 🖼️ Profile Picture Uploads
- File size must be under ~1MB
- Limited to JPG and PNG formats

### 🔄 OAuth Token Refresh
- Access tokens use client credentials flow
- Token/session persistence is not user-specific yet

---

## 🔮 Future Improvements

- Add personalised song recommendations using user listening history
- Persist user theme preference server-side
- Enable Spotify account login and access to user playlists
- Improve mobile responsiveness
- Add search history and user favorite lists

---

🛠️ Maintained by the **Jamigos Development Team**:  
**Samira**, **Christina**, **Oveena**, **Akasha**