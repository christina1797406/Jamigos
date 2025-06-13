CREATE DATABASE IF NOT EXISTS account_manager;
USE account_manager;
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    user_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE DATABASE IF NOT EXISTS oauth;
USE oauth;
CREATE TABLE IF NOT EXISTS Oauth_token (
    oauth_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    oauth_provider VARCHAR(50) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT DEFAULT NULL,
    token_expiration DATETIME,
    token_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES account_manager.Users(user_id) ON DELETE CASCADE
);

CREATE DATABASE IF NOT EXISTS spotify;
USE spotify;
CREATE TABLE IF NOT EXISTS spotify_info (
    spotify_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spotify_account_id VARCHAR(255) NOT NULL,
    spotify_username VARCHAR(255) NOT NULL,
    spotify_access_token TEXT NOT NULL,
    spotify_refresh_token TEXT DEFAULT NULL,
    spotify_plan VARCHAR(50) DEFAULT NULL,
    access_token_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_token_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES account_manager.Users(user_id) ON DELETE CASCADE
);