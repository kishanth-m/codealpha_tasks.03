document.addEventListener('DOMContentLoaded', () => {
    const mainAudio = document.getElementById('main-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const coverImage = document.getElementById('cover-image');
    const currentTimeSpan = document.getElementById('current-time');
    const totalDurationSpan = document.getElementById('total-duration');
    const progressBar = document.querySelector('.progress-bar');
    const currentProgress = document.querySelector('.current-progress');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistBtn = document.getElementById('playlist-btn');
    const playlistSidebar = document.querySelector('.playlist-sidebar');
    const playlistList = document.getElementById('playlist-list');
    const playerContainer = document.querySelector('.player-container');

    let isPlaying = false;
    let currentSongIndex = 0;
    let autoplayEnabled = false; // Bonus: Autoplay feature

    // Sample playlist (you can expand this)
    const playlist = [
        {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            src: 'songs/blinding_lights.mp3', // Make sure these paths are correct
            cover: 'images/blinding_lights_cover.jpg'
        },
        {
            title: 'Circles',
            artist: 'Post Malone',
            src: 'songs/circles.mp3',
            cover: 'images/circles_cover.jpg'
        },
        {
            title: 'Levitating',
            artist: 'Dua Lipa',
            src: 'songs/levitating.mp3',
            cover: 'images/levitating_cover.jpg'
        },
        {
            title: 'Dynamite',
            artist: 'BTS',
            src: 'songs/dynamite.mp3',
            cover: 'images/dynamite_cover.jpg'
        }
    ];

    // Function to load a song
    function loadSong(song) {
        // Blur out effect before loading new song
        playerContainer.classList.add('blur-out');
        playerContainer.classList.remove('blur-in');

        // Zoom out effect
        playerContainer.classList.add('zoom-out');
        playerContainer.classList.remove('zoom-in');

        setTimeout(() => { // Give a small delay for the transition to be visible
            songTitle.textContent = song.title;
            artistName.textContent = song.artist;
            coverImage.src = song.cover;
            mainAudio.src = song.src;

            // Reset progress bar
            currentProgress.style.width = '0%';
            currentTimeSpan.textContent = '0:00';
            totalDurationSpan.textContent = '0:00';

            // After loading, blur in and zoom in
            playerContainer.classList.remove('blur-out');
            playerContainer.classList.add('blur-in');
            playerContainer.classList.remove('zoom-out');
            playerContainer.classList.add('zoom-in');

            if (isPlaying) {
                mainAudio.play();
            }
        }, 300); // Adjust delay as needed for transitions
    }

    // Play/Pause functionality
    function playSong() {
        isPlaying = true;
        mainAudio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseSong() {
        isPlaying = false;
        mainAudio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        updatePlaylistHighlight();
    }

    nextBtn.addEventListener('click', nextSong);

    // Previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        updatePlaylistHighlight();
    }

    prevBtn.addEventListener('click', prevSong);

    // Update progress bar
    mainAudio.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.target;
        const progressPercent = (currentTime / duration) * 100;
        currentProgress.style.width = `${progressPercent}%`;

        // Update current time
        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeSpan.textContent = `${currentMinutes}:${currentSeconds}`;
    });

    // Update total duration (when song metadata is loaded)
    mainAudio.addEventListener('loadedmetadata', () => {
        let totalMinutes = Math.floor(mainAudio.duration / 60);
        let totalSeconds = Math.floor(mainAudio.duration % 60);
        if (totalSeconds < 10) totalSeconds = `0${totalSeconds}`;
        totalDurationSpan.textContent = `${totalMinutes}:${totalSeconds}`;
    });

    // Seek functionality (click on progress bar)
    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickedOffsetX = e.offsetX;
        const duration = mainAudio.duration;
        mainAudio.currentTime = (clickedOffsetX / progressWidth) * duration;
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        mainAudio.volume = e.target.value;
    });

    // Playlist functionality
    function renderPlaylist() {
        playlistList.innerHTML = ''; // Clear existing list
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
            `;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(playlist[currentSongIndex]);
                playSong();
                updatePlaylistHighlight();
            });
            playlistList.appendChild(li);
        });
        updatePlaylistHighlight();
    }

    function updatePlaylistHighlight() {
        const playlistItems = playlistList.querySelectorAll('li');
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    playlistBtn.addEventListener('click', () => {
        playlistSidebar.classList.toggle('show');
    });

    // Autoplay next song when current song ends
    mainAudio.addEventListener('ended', () => {
        if (autoplayEnabled) {
            nextSong();
            playSong(); // Ensure next song plays automatically
        } else {
            pauseSong(); // If autoplay is off, pause at the end
        }
    });

    // Initial load
    loadSong(playlist[currentSongIndex]);
    renderPlaylist();
    mainAudio.volume = volumeSlider.value; // Set initial volume

    // Bonus: Add an autoplay toggle (can be a button or checkbox in HTML)
    // For simplicity, let's add a button and toggle functionality
    // (You'd need to add this button to your HTML)
    // const autoplayToggleBtn = document.getElementById('autoplay-toggle-btn');
    // if (autoplayToggleBtn) {
    //     autoplayToggleBtn.addEventListener('click', () => {
    //         autoplayEnabled = !autoplayEnabled;
    //         autoplayToggleBtn.textContent = autoplayEnabled ? 'Autoplay: ON' : 'Autoplay: OFF';
    //         console.log('Autoplay:', autoplayEnabled);
    //     });
    // }

    // Initial zoom-in and blur-in on page load
    document.body.classList.add('loaded'); // Trigger CSS transition for initial load
});
