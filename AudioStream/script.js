// ===== TRACKS DATA =====
let tracks = [
    {
        title: "Akhwarun Akhwarun",
        src: "./Audio/Audio1.mpeg",
        cover: "./Assets/Images/podcast.jpg",
        artist: "Islamic Nasheed",
        category: "nasheed",
        duration: 0
    },
    {
        title: "Muhammad Nabeena",
        src: "./Audio/Audio2.mpeg",
        cover: "./Assets/Images/lecture2.jpg",
        artist: "Islamic Nasheed",
        category: "nasheed",
        duration: 0
    },
    {
        title: "Ma Lajpalan",
        src: "./Audio/Audio3.mpeg",
        cover: "./Assets/Images/madina.jpg",
        artist: "Islamic Nasheed",
        category: "nasheed",
        duration: 0
    },
    {
        title: "Kamli Valay Muhammad",
        src: "./Audio/Audio4.mpeg",
        cover: "./Assets/Images/extra.jpg",
        artist: "Islamic Nasheed",
        category: "nasheed",
        duration: 0
    },
    {
        title: "Alnazara Alakhira",
        src: "./Audio/Audio6.mpeg",
        cover: "./Assets/Images/Alnazara Alakhira.jpg",
        artist: "Islamic Nasheed",
        category: "nasheed",
        duration: 0
    }
];

// ===== DOM ELEMENTS (with null checks) =====
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const repeatBtn = document.getElementById('repeat');
const shuffleBtn = document.getElementById('shuffle');
const progressFill = document.getElementById('progressFill');
const progressTrack = document.getElementById('progressTrack');
const volumeSlider = document.getElementById('volume');
const volumeBtn = document.getElementById('volumeBtn');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const speedBtn = document.getElementById('speedBtn');
const sleepBtn = document.getElementById('sleepBtn');

// ===== PLAYER STATE =====
let currentTrack = 0;
let isPlaying = false;
let volume = 0.7;
let isShuffled = false;
let loopMode = 'none';
let playbackSpeed = 1.0;
let sleepTimer = null;
let sleepTime = 0;

// ===== UTILITY FUNCTIONS =====
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds === undefined || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function saveToLocal() {
    try {
        localStorage.setItem('tracks', JSON.stringify(tracks));
        localStorage.setItem('currentTrack', currentTrack);
        localStorage.setItem('volume', volume);
        localStorage.setItem('playbackSpeed', playbackSpeed);
        localStorage.setItem('loopMode', loopMode);
        localStorage.setItem('isShuffled', isShuffled);
        if (audio) {
            localStorage.setItem('currentTime', audio.currentTime || 0);
        }
        localStorage.setItem('isPlaying', isPlaying);
    } catch(e) {
        console.log('Save error:', e);
    }
}

function loadFromLocal() {
    try {
        const savedTracks = localStorage.getItem('tracks');
        if (savedTracks) {
            const parsed = JSON.parse(savedTracks);
            if (parsed && parsed.length > 0) {
                tracks = parsed;
            }
        }
        
        const savedIndex = localStorage.getItem('currentTrack');
        if (savedIndex !== null && parseInt(savedIndex) < tracks.length) {
            currentTrack = parseInt(savedIndex);
        }
        
        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) volume = parseFloat(savedVolume);
        
        const savedSpeed = localStorage.getItem('playbackSpeed');
        if (savedSpeed !== null) playbackSpeed = parseFloat(savedSpeed);
        
        const savedLoop = localStorage.getItem('loopMode');
        if (savedLoop !== null) loopMode = savedLoop;
        
        const savedShuffle = localStorage.getItem('isShuffled');
        if (savedShuffle !== null) isShuffled = savedShuffle === 'true';
    } catch(e) {
        console.log('Load error:', e);
    }
}

// ===== LOAD TRACK =====
function loadTrack(index) {
    if (tracks.length === 0) return;
    
    currentTrack = (index + tracks.length) % tracks.length;
    const track = tracks[currentTrack];
    if (!track) return;
    
    if (audio) {
        audio.src = track.src;
        audio.load();
    }
    
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist || 'Unknown';
    if (coverEl && track.cover) coverEl.src = track.cover;
    
    // Update mini player
    const miniTitle = document.getElementById('miniTitle');
    const miniArtist = document.getElementById('miniArtist');
    const miniCover = document.getElementById('miniCover');
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniArtist) miniArtist.textContent = track.artist || 'Unknown';
    if (miniCover && track.cover) miniCover.src = track.cover;
    
    updateUI();
    saveToLocal();
}

// ===== PLAYBACK CONTROLS =====
function togglePlay() {
    if (!audio || !audio.src) return;
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play().catch(() => {});
        isPlaying = true;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (window.startVisualizer) startVisualizer();
    }
    updateUI();
    saveToLocal();
}

function nextTrack() {
    if (tracks.length === 0) return;
    
    if (isShuffled) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * tracks.length);
        } while (randomIndex === currentTrack && tracks.length > 1);
        currentTrack = randomIndex;
    } else {
        currentTrack = (currentTrack + 1) % tracks.length;
    }
    loadTrack(currentTrack);
    if (isPlaying && audio) {
        audio.play().catch(() => {});
    }
}

function prevTrack() {
    if (tracks.length === 0) return;
    
    if (audio && audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying && audio) {
        audio.play().catch(() => {});
    }
}

function toggleLoop() {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(loopMode);
    loopMode = modes[(currentIndex + 1) % modes.length];
    
    if (audio) audio.loop = loopMode === 'one';
    if (repeatBtn) repeatBtn.classList.toggle('active', loopMode !== 'none');
    updateUI();
    saveToLocal();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    if (shuffleBtn) shuffleBtn.classList.toggle('active', isShuffled);
    updateUI();
    saveToLocal();
}

function setVolume(value) {
    volume = Math.max(0, Math.min(1, value));
    if (audio) audio.volume = volume;
    if (volumeSlider) volumeSlider.value = volume * 100;
    
    if (volumeBtn) {
        if (volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.3) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
        } else if (volume < 0.7) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    saveToLocal();
}

function toggleMute() {
    if (volume > 0) {
        setVolume(0);
    } else {
        setVolume(0.7);
    }
}

function setPlaybackSpeed(speed) {
    playbackSpeed = Math.max(0.5, Math.min(2, speed));
    if (audio) audio.playbackRate = playbackSpeed;
    if (speedBtn) {
        speedBtn.textContent = playbackSpeed + 'x';
        speedBtn.classList.toggle('active', playbackSpeed !== 1);
    }
    saveToLocal();
}

function setSleepTimer(minutes) {
    if (sleepTimer) {
        clearTimeout(sleepTimer);
        sleepTimer = null;
    }
    
    sleepTime = minutes;
    if (sleepBtn) {
        if (minutes > 0) {
            sleepBtn.innerHTML = `<i class="fas fa-bed"></i> ${minutes}m`;
            sleepBtn.classList.add('active');
            sleepTimer = setTimeout(() => {
                if (isPlaying) togglePlay();
                if (sleepBtn) {
                    sleepBtn.innerHTML = '<i class="fas fa-bed"></i>';
                    sleepBtn.classList.remove('active');
                }
                sleepTime = 0;
                sleepTimer = null;
                showToast(`Sleep timer ended after ${minutes} minutes`);
            }, minutes * 60 * 1000);
        } else {
            sleepBtn.innerHTML = '<i class="fas fa-bed"></i>';
            sleepBtn.classList.remove('active');
        }
    }
    saveToLocal();
}

// ===== EQUALIZER =====
function initEqualizer() {
    const eqToggle = document.getElementById('eqToggle');
    const eqPanel = document.getElementById('equalizerPanel');
    const eqBands = document.getElementById('eqBands');
    
    if (!eqToggle || !eqPanel || !eqBands) return;
    
    const freqs = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    let eqGains = new Array(10).fill(0);
    
    eqBands.innerHTML = '';
    freqs.forEach((freq, i) => {
        const band = document.createElement('div');
        band.className = 'eq-band';
        band.innerHTML = `
            <input type="range" min="-12" max="12" value="0" step="0.5" data-index="${i}">
            <label>${freq}</label>
        `;
        eqBands.appendChild(band);
        
        band.querySelector('input').addEventListener('input', function() {
            eqGains[i] = parseFloat(this.value);
            applyEqualizer(eqGains);
        });
    });
    
    document.querySelectorAll('.eq-preset').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.eq-preset').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const presets = {
                flat: [0,0,0,0,0,0,0,0,0,0],
                bass: [6,5,4,3,0,-1,-2,-3,-4,-5],
                treble: [-5,-4,-3,-2,0,2,3,4,5,6],
                vocal: [-2,-1,0,1,3,4,3,1,0,-2]
            };
            
            const preset = this.dataset.preset;
            if (preset && presets[preset]) {
                eqGains = [...presets[preset]];
                applyEqualizer(eqGains);
                document.querySelectorAll('.eq-band input').forEach((input, i) => {
                    input.value = eqGains[i] || 0;
                });
            }
        });
    });
    
    let audioContext = null;
    let analyser = null;
    let eqNodes = [];
    let source = null;
    
    function applyEqualizer(gains) {
        try {
            if (!audioContext && audio) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            }
            
            if (!audioContext || !audio) return;
            
            eqNodes.forEach(node => {
                try { node.disconnect(); } catch(e) {}
            });
            eqNodes = [];
            
            source = audioContext.createMediaElementSource(audio);
            let currentNode = source;
            
            gains.forEach((gain, i) => {
                const filter = audioContext.createBiquadFilter();
                filter.type = 'peaking';
                filter.frequency.value = freqs[i];
                filter.Q.value = 1;
                filter.gain.value = gain || 0;
                currentNode.connect(filter);
                eqNodes.push(filter);
                currentNode = filter;
            });
            
            currentNode.connect(analyser);
            analyser.connect(audioContext.destination);
            
            window.analyser = analyser;
            
        } catch(e) {
            console.log('Equalizer not supported');
        }
    }
    
    eqToggle.addEventListener('click', function() {
        eqPanel.classList.toggle('show');
        this.classList.toggle('active');
    });
}

// ===== VISUALIZER =====
function initVisualizer() {
    const canvas = document.getElementById('visualizer');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
    canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 300;
    
    window.startVisualizer = function() {
        if (!window.analyser) return;
        
        const dataArray = new Uint8Array(window.analyser.frequencyBinCount);
        
        function draw() {
            if (!isPlaying) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                requestAnimationFrame(draw);
                return;
            }
            
            window.analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / dataArray.length) * 2;
            let x = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                const hue = 140 + (i / dataArray.length) * 40;
                ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
    };
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
    const toastEl = document.getElementById('toast');
    if (toastEl) {
        toastEl.textContent = message;
        toastEl.style.display = 'block';
        clearTimeout(toastEl._timeout);
        toastEl._timeout = setTimeout(() => {
            toastEl.style.display = 'none';
        }, 3000);
    }
}

// ===== UPDATE UI =====
function updateUI() {
    const track = tracks[currentTrack];
    if (!track) return;
    
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist || 'Unknown';
    if (coverEl && track.cover) coverEl.src = track.cover;
    
    // Update mini player
    const miniTitle = document.getElementById('miniTitle');
    const miniArtist = document.getElementById('miniArtist');
    const miniCover = document.getElementById('miniCover');
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniArtist) miniArtist.textContent = track.artist || 'Unknown';
    if (miniCover && track.cover) miniCover.src = track.cover;
    
    if (playBtn) {
        playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
    
    const miniPlay = document.getElementById('miniPlay');
    if (miniPlay) {
        miniPlay.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
    
    if (repeatBtn) repeatBtn.classList.toggle('active', loopMode !== 'none');
    if (shuffleBtn) shuffleBtn.classList.toggle('active', isShuffled);
    if (speedBtn) speedBtn.textContent = playbackSpeed + 'x';
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (audio) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (audio) audio.currentTime = Math.max(audio.currentTime - 5, 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(Math.min(1, volume + 0.05));
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(Math.max(0, volume - 0.05));
                break;
            case 'm':
            case 'M':
                toggleMute();
                break;
            case 'n':
            case 'N':
                nextTrack();
                break;
            case 'p':
            case 'P':
                prevTrack();
                break;
        }
    });
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (repeatBtn) repeatBtn.addEventListener('click', toggleLoop);
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            setVolume(e.target.value / 100);
        });
    }
    if (volumeBtn) volumeBtn.addEventListener('click', toggleMute);
    
    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
            const currentIndex = speeds.indexOf(playbackSpeed);
            const nextIndex = (currentIndex + 1) % speeds.length;
            setPlaybackSpeed(speeds[nextIndex]);
        });
    }
    
    if (sleepBtn) {
        sleepBtn.addEventListener('click', () => {
            const times = [0, 5, 10, 15, 30, 60];
            const currentIndex = times.indexOf(sleepTime);
            const nextIndex = (currentIndex + 1) % times.length;
            setSleepTimer(times[nextIndex]);
        });
    }
    
    if (progressTrack) {
        progressTrack.addEventListener('click', (e) => {
            const rect = progressTrack.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            if (audio && audio.duration) {
                audio.currentTime = x * audio.duration;
            }
        });
    }
    
    if (audio) {
        audio.addEventListener('timeupdate', () => {
            if (audio.duration && !isNaN(audio.duration)) {
                const percent = (audio.currentTime / audio.duration) * 100;
                if (progressFill) progressFill.style.width = percent + '%';
                if (currentTimeSpan) currentTimeSpan.textContent = formatTime(audio.currentTime);
                if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
                
                const miniProgress = document.getElementById('miniProgress');
                if (miniProgress) miniProgress.style.width = percent + '%';
            }
            saveToLocal();
        });
        
        audio.addEventListener('loadedmetadata', () => {
            if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('ended', () => {
            if (loopMode === 'all' || loopMode === 'none') {
                nextTrack();
            }
        });
    }
    
    window.addEventListener('beforeunload', saveToLocal);
}

// ===== INITIALIZE PLAYLIST PAGE =====
function initPlaylistPage() {
    const listEl = document.getElementById('playlistList');
    const searchInput = document.getElementById('searchInput');
    const importBtn = document.getElementById('importBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (!listEl) return;
    
    function renderPlaylist(filter = 'all', search = '') {
        listEl.innerHTML = '';
        let filteredTracks = [...tracks];
        
        if (filter !== 'all') {
            filteredTracks = filteredTracks.filter(t => t.category === filter);
        }
        
        if (search) {
            const s = search.toLowerCase();
            filteredTracks = filteredTracks.filter(t => 
                t.title.toLowerCase().includes(s) || 
                (t.artist && t.artist.toLowerCase().includes(s))
            );
        }
        
        const emptyState = document.getElementById('emptyState');
        if (filteredTracks.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            const totalEl = document.getElementById('totalTracks');
            if (totalEl) totalEl.textContent = '0 tracks';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';
        
        filteredTracks.forEach((track) => {
            const realIndex = tracks.indexOf(track);
            const li = document.createElement('li');
            li.className = realIndex === currentTrack ? 'active' : '';
            li.innerHTML = `
                <span class="track-icon"><i class="fas fa-music"></i></span>
                <div class="track-info">
                    <div class="track-title">${track.title || 'Untitled'}</div>
                    <div class="track-artist">${track.artist || 'Unknown'}</div>
                </div>
                <span class="track-duration">${formatTime(track.duration)}</span>
                <div class="track-actions">
                    <button onclick="removeTrack(${realIndex})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            li.addEventListener('click', () => {
                currentTrack = realIndex;
                loadTrack(currentTrack);
                if (isPlaying && audio) {
                    audio.play().catch(() => {});
                } else {
                    togglePlay();
                }
                renderPlaylist(filter, search);
            });
            listEl.appendChild(li);
        });
        
        const totalEl = document.getElementById('totalTracks');
        if (totalEl) totalEl.textContent = `${filteredTracks.length} tracks`;
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeFilter = document.querySelector('.filter-btn.active');
            renderPlaylist(activeFilter?.dataset.filter || 'all', searchInput.value);
        });
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderPlaylist(this.dataset.filter, searchInput?.value || '');
        });
    });
    
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    tracks.push({
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        src: e.target.result,
                        cover: './Assets/Images/podcast.jpg',
                        artist: 'Imported',
                        category: 'imported',
                        duration: 0,
                        imported: true
                    });
                    saveToLocal();
                    const activeFilter = document.querySelector('.filter-btn.active');
                    renderPlaylist(activeFilter?.dataset.filter || 'all', searchInput?.value || '');
                    showToast(`Imported: ${file.name}`);
                };
                reader.readAsDataURL(file);
            });
            this.value = '';
        });
    }
    
    // Mini player controls
    const miniPlay = document.getElementById('miniPlay');
    const miniPrev = document.getElementById('miniPrev');
    const miniNext = document.getElementById('miniNext');
    
    if (miniPlay) miniPlay.addEventListener('click', togglePlay);
    if (miniPrev) miniPrev.addEventListener('click', prevTrack);
    if (miniNext) miniNext.addEventListener('click', nextTrack);
    
    renderPlaylist();
    updateUI();
}

// ===== REMOVE TRACK =====
function removeTrack(index) {
    if (tracks.length <= 1) {
        showToast('Cannot remove the last track');
        return;
    }
    tracks.splice(index, 1);
    if (currentTrack >= tracks.length) currentTrack = tracks.length - 1;
    saveToLocal();
    loadTrack(currentTrack);
    
    const activeFilter = document.querySelector('.filter-btn.active');
    const searchInput = document.getElementById('searchInput');
    if (typeof renderPlaylist === 'function') {
        renderPlaylist(activeFilter?.dataset.filter || 'all', searchInput?.value || '');
    }
    showToast('Track removed');
}

// ===== INITIALIZE =====
function init() {
    loadFromLocal();
    
    if (tracks.length > 0) {
        loadTrack(currentTrack);
    }
    
    setupEventListeners();
    initKeyboardShortcuts();
    initEqualizer();
    initVisualizer();
    updateUI();
    
    if (audio && volume) {
        audio.volume = volume;
        if (volumeSlider) volumeSlider.value = volume * 100;
    }
    
    if (audio && playbackSpeed) {
        audio.playbackRate = playbackSpeed;
    }
    
    // If on playlist page, init playlist
    if (window.location.pathname.includes('playlist.html')) {
        initPlaylistPage();
    }
    
    // Auto-play if was playing
    const wasPlaying = localStorage.getItem('isPlaying');
    if (wasPlaying === 'true' && audio && audio.src) {
        setTimeout(() => {
            audio.play().catch(() => {});
            isPlaying = true;
            updateUI();
        }, 500);
    }
    
    console.log('Audio Player initialized successfully!');
    console.log(`Loaded ${tracks.length} tracks`);
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);