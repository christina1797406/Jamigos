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

