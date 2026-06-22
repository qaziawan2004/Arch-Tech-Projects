let tracks = [
    {
        title: "Akhwarun Akhwarun",
        src: "./Audio/Audio1.mpeg",
        cover: "./Assets/Images/podcast.jpg"
    },
    {
        title: "Muhammad Nabeena",
        src: "./Audio/Audio2.mpeg",
        cover: "./Assets/Images/lecture2.jpg"
    },
    {
        title: "Ma Lajpalan",
        src: "./Audio/Audio3.mpeg",
        cover: "./Assets/Images/madina.jpg"
    },
    {
        title: "Kamli Valay Muhammad",
        src: "./Audio/Audio4.mpeg",
        cover: "./Assets/Images/extra.jpg"
    },
    {
        title: "Alnazara Alakhira",
        src: "./Audio/Audio6.mpeg",
        cover: "./Assets/Images/Alnazara Alakhira.jpg"
    }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");
const volumeSlider = document.getElementById("volume");
const volumeIcon = document.querySelector(".volume-container span");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");

let currentTrack = 0;
let isPlaying = false;
let currentVolume = 0.7;
let volumeLevels = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
let currentVolumeLevel = 4;

function formatTime(t) {
    if (isNaN(t) || t === undefined) return "0:00";
    let m = Math.floor(t / 60);
    let s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getVolumeLevel(value) {
    for (let i = 0; i < volumeLevels.length; i++) {
        if (value <= volumeLevels[i] + 0.05) {
            return i;
        }
    }
    return volumeLevels.length - 1;
}

function updateVolumeUI(value) {
    currentVolume = value;
    if (audio) audio.volume = value;
    if (volumeSlider) volumeSlider.value = value;

    if (volumeIcon) {
        if (value === 0) {
            volumeIcon.textContent = "🔇";
        } else if (value <= 0.2) {
            volumeIcon.textContent = "🔈";
        } else if (value <= 0.4) {
            volumeIcon.textContent = "🔉";
        } else {
            volumeIcon.textContent = "🔊";
        }
    }

    localStorage.setItem("volume", value);
    currentVolumeLevel = getVolumeLevel(value);
}

function increaseVolume() {
    if (currentVolumeLevel < volumeLevels.length - 1) {
        currentVolumeLevel++;
        updateVolumeUI(volumeLevels[currentVolumeLevel]);
    } else {
        updateVolumeUI(1.0);
    }
}

function decreaseVolume() {
    if (currentVolumeLevel > 0) {
        currentVolumeLevel--;
        updateVolumeUI(volumeLevels[currentVolumeLevel]);
    } else {
        updateVolumeUI(0);
    }
}

let mutedVolume = 0.7;

if (volumeIcon) {
    volumeIcon.onclick = (e) => {
        e.stopPropagation();
        if (currentVolume > 0) {
            mutedVolume = currentVolume;
            updateVolumeUI(0);
            currentVolumeLevel = 0;
        } else {
            updateVolumeUI(mutedVolume);
            currentVolumeLevel = getVolumeLevel(mutedVolume);
        }
    };
}

if (volumeSlider) {
    volumeSlider.oninput = (e) => {
        const value = parseFloat(e.target.value);
        currentVolumeLevel = getVolumeLevel(value);
        updateVolumeUI(value);
    };
}

function loadTrack(index, saveToStorage = true) {

    if (tracks.length === 0) return;

    if (index >= tracks.length) {
        index = 0;
    }

    if (index < 0) {
        index = tracks.length - 1;
    }

    currentTrack = index;

    if (audio) {
        audio.src = tracks[index].src;
    }

    if (title) {
        title.textContent = tracks[index].title;
    }

    if (cover && tracks[index].cover) {
        cover.src = tracks[index].cover;
    }

    if (saveToStorage) {
        localStorage.setItem("trackIndex", index);
        localStorage.setItem("trackChanged", "true");
    }
}

function updateTrackDisplay() {

    if (!tracks[currentTrack]) return;

    if (title) {
        title.textContent = tracks[currentTrack].title;
    }

    if (cover && tracks[currentTrack].cover) {
        cover.src = tracks[currentTrack].cover;
    }
}

function saveTracksToLocal() {
    const tracksToSave = tracks.map(track => ({
        title: track.title,
        src: track.src,
        cover: track.cover
    }));
    localStorage.setItem("importedTracks", JSON.stringify(tracksToSave));
}

function loadTracksFromLocal() {
    const savedTracks = localStorage.getItem("importedTracks");
    if (savedTracks) {
        const parsedTracks = JSON.parse(savedTracks);
        if (parsedTracks && parsedTracks.length > 0) {
           tracks = parsedTracks.filter(track => track.src);
        }
    }
}

loadTracksFromLocal();

const isPlaylistPage =
    window.location.pathname.includes("playlist.html");

const savedTrackIndex = localStorage.getItem("trackIndex");
const savedTrackChanged = localStorage.getItem("trackChanged");

if (
    savedTrackIndex !== null &&
    parseInt(savedTrackIndex) < tracks.length &&
    parseInt(savedTrackIndex) >= 0
) {
    currentTrack = parseInt(savedTrackIndex);
} else {
    currentTrack = 0;
}

if (!isPlaylistPage) {

    loadTrack(currentTrack, false);

    const savedPlayingState = localStorage.getItem("isPlaying");

    audio.addEventListener("loadedmetadata", () => {

        const savedTime =
            parseFloat(localStorage.getItem("currentTime")) || 0;

        audio.currentTime = savedTime;

        if (savedPlayingState === "true") {
            audio.play().catch(() => {});
            playBtn.textContent = "⏸";
            isPlaying = true;
        }
    });

}

const savedTime = localStorage.getItem("currentTime");
const savedPlayingState = localStorage.getItem("isPlaying");
const savedVolume = localStorage.getItem("volume");

if (savedVolume !== null) {
    const vol = parseFloat(savedVolume);
    currentVolumeLevel = getVolumeLevel(vol);
    updateVolumeUI(vol);
} else {
    currentVolumeLevel = 4;
    updateVolumeUI(0.7);
}

if (savedTime && parseFloat(savedTime) > 0) {
    if (audio) {
        audio.addEventListener("loadedmetadata", () => {
            audio.currentTime = parseFloat(savedTime);
            if (savedPlayingState === 'true') {
                audio.play().catch(e => console.log("Playback error:", e));
                if (playBtn) playBtn.textContent = "⏸";
                isPlaying = true;
            }
        });
    }
}

if (playBtn) {
    playBtn.onclick = () => {
        if (isPlaying) {
            if (audio) audio.pause();
            playBtn.textContent = "▶";
            isPlaying = false;
            localStorage.setItem("isPlaying", "false");
        } else {
            if (audio) audio.play();
            playBtn.textContent = "⏸";
            isPlaying = true;
            localStorage.setItem("isPlaying", "true");
        }
    };
}

if (nextBtn) {
    nextBtn.onclick = () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack, true);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
        if (playBtn) playBtn.textContent = "⏸";
        isPlaying = true;
        localStorage.setItem("isPlaying", "true");
        localStorage.setItem("currentTime", 0);
    };
}

if (prevBtn) {
    prevBtn.onclick = () => {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrack, true);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
        if (playBtn) playBtn.textContent = "⏸";
        isPlaying = true;
        localStorage.setItem("isPlaying", "true");
        localStorage.setItem("currentTime", 0);
    };
}

if (repeatBtn) {
    repeatBtn.onclick = () => {
        if (audio) audio.loop = !audio.loop;
        repeatBtn.style.opacity = audio && audio.loop ? "1" : "0.5";
    };
}

if (audio) {
    audio.addEventListener("timeupdate", () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progress) progress.style.width = percent + "%";

            if (currentTimeSpan) currentTimeSpan.textContent = formatTime(audio.currentTime);
            if (durationSpan) durationSpan.textContent = formatTime(audio.duration);

            localStorage.setItem("currentTime", audio.currentTime);
        }
    });

    audio.addEventListener("loadedmetadata", () => {
        if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
    });
}

if (progressContainer) {
    progressContainer.onclick = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const width = rect.width;
        const clickX = e.clientX - rect.left;
        const percentage = clickX / width;
        if (audio) audio.currentTime = percentage * audio.duration;
    };
}

if (repeatBtn && audio) {
    repeatBtn.style.opacity = audio.loop ? "1" : "0.5";
}

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === "ArrowUp") {
        e.preventDefault();
        increaseVolume();
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decreaseVolume();
    }
});

if (window.location.pathname.includes("playlist.html")) {
    const listItems = document.querySelectorAll("#playlist-list li");
    const miniTitle = document.getElementById("mini-title");
    const miniPlayBtn = document.getElementById("playBtn");
    const miniPrevBtn = document.getElementById("prevBtn");
    const miniNextBtn = document.getElementById("nextBtn");
    const progressFill = document.getElementById("mini-progress");
    const miniCurrentTime = document.getElementById("mini-current-time");
    const miniDuration = document.getElementById("mini-duration");
    const playlistPage = document.getElementById("playlistPage");
    const miniPlayer = document.getElementById("miniPlayer");
    const importBtn = document.getElementById("importBtn");
    const fileInput = document.getElementById("fileInput");

    if (importBtn) {
        importBtn.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    function refreshPlaylistDisplay() {
        const playlistContainer = document.getElementById("playlist-list");
        if (!playlistContainer) return;

        playlistContainer.innerHTML = "";

        tracks.forEach((track, idx) => {
            const li = document.createElement("li");
            li.textContent = track.title;
            li.setAttribute("data-src", track.src);
            li.setAttribute("data-index", idx);

            li.addEventListener("click", (e) => {
                e.stopPropagation();
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.src = track.src;
                    if (miniTitle) miniTitle.textContent = track.title;
                    localStorage.setItem("trackIndex", idx);
                    localStorage.setItem("trackChanged", "true");
                    localStorage.setItem("currentTime", 0);
                    audio.play().catch(e => console.log("Playback error:", e));
                    if (miniPlayBtn) miniPlayBtn.textContent = "⏸";
                    localStorage.setItem("isPlaying", "true");
                }
            });

            playlistContainer.appendChild(li);
        });
    }
    refreshPlaylistDisplay();

    if (importBtn && fileInput) {
        importBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            fileInput.click();
        };

        fileInput.onchange = (e) => {
            e.stopPropagation();
            const files = Array.from(e.target.files);

            files.forEach((file) => {

                const fileName = file.name.replace(/\.[^/.]+$/, "");

                const reader = new FileReader();

                reader.onload = function () {

                    tracks.push({
                        title: fileName,
                        src: reader.result,
                        cover: "./Assets/Images/podcast.jpg",
                        imported: true
                    });

                    saveTracksToLocal();
                    refreshPlaylistDisplay();
                };

                reader.readAsDataURL(file);

            });

            saveTracksToLocal();
            refreshPlaylistDisplay();

            fileInput.value = "";

            alert(`${files.length} audio file(s) imported successfully!`);
        };
    }

    let playlistTracks = [];

    if (listItems && listItems.length > 0) {
        listItems.forEach((item, index) => {
            let trackSrc = "";
            let trackTitle = item.textContent;

            if (trackTitle === "Akhwarun Akhwarun") {
                trackSrc = "./Audio/Audio1.mpeg";
            } else if (trackTitle === "Muhammad Nabeena") {
                trackSrc = "./Audio/Audio2.mpeg";
            } else if (trackTitle === "Ma Lajpalan") {
                trackSrc = "./Audio/Audio3.mpeg";
            } else if (trackTitle === "Kamli Valay Muhammad") {
                trackSrc = "./Audio/Audio4.mpeg";
            } else if (trackTitle === "Alnazara Alakhira") {
                trackSrc = "./Audio/Audio6.mpeg";
            } else {
                trackSrc = item.dataset.src;
            }

            playlistTracks.push({
                title: trackTitle,
                src: trackSrc,
                index: index
            });

            item.addEventListener("click", (e) => {
                e.stopPropagation();
                const selectedTrack = playlistTracks[index];
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.src = selectedTrack.src;
                    currentTrack = index;
                    if (miniTitle) miniTitle.textContent = selectedTrack.title;
                    localStorage.setItem("trackIndex", index);
                    localStorage.setItem("trackChanged", "true");
                    localStorage.setItem("currentTime", 0);
                    audio.play().catch(e => console.log("Playback error:", e));
                    if (miniPlayBtn) miniPlayBtn.textContent = "⏸";
                    localStorage.setItem("isPlaying", "true");
                }
            });
        });
    }

    if (miniPlayBtn) {
        miniPlayBtn.onclick = (e) => {
            e.stopPropagation();
            if (audio) {
                if (audio.paused) {
                    audio.play();
                    miniPlayBtn.textContent = "⏸";
                    localStorage.setItem("isPlaying", "true");
                } else {
                    audio.pause();
                    miniPlayBtn.textContent = "▶";
                    localStorage.setItem("isPlaying", "false");
                }
            }
        };
    }

    if (miniNextBtn) {
        miniNextBtn.onclick = (e) => {
            e.stopPropagation();
            let currentIdx = parseInt(localStorage.getItem("trackIndex")) || 0;
            let nextIdx = (currentIdx + 1) % tracks.length;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.src = tracks[nextIdx].src;
                currentTrack = nextIdx;
                if (miniTitle) miniTitle.textContent = tracks[nextIdx].title;
                localStorage.setItem("trackIndex", nextIdx);
                localStorage.setItem("trackChanged", "true");
                localStorage.setItem("currentTime", 0);
                audio.play();
                if (miniPlayBtn) miniPlayBtn.textContent = "⏸";
                localStorage.setItem("isPlaying", "true");
            }
        };
    }

    if (miniPrevBtn) {
        miniPrevBtn.onclick = (e) => {
            e.stopPropagation();
            let currentIdx = parseInt(localStorage.getItem("trackIndex")) || 0;
            let prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.src = tracks[prevIdx].src;
                currentTrack = prevIdx;
                if (miniTitle) miniTitle.textContent = tracks[prevIdx].title;
                localStorage.setItem("trackIndex", prevIdx);
                localStorage.setItem("trackChanged", "true");
                localStorage.setItem("currentTime", 0);
                audio.play();
                if (miniPlayBtn) miniPlayBtn.textContent = "⏸";
                localStorage.setItem("isPlaying", "true");
            }
        };
    }

    if (audio) {
        audio.addEventListener("timeupdate", () => {
            if (audio.duration && !isNaN(audio.duration)) {
                const percent = (audio.currentTime / audio.duration) * 100;
                if (progressFill) progressFill.style.width = percent + "%";
                if (miniCurrentTime) miniCurrentTime.textContent = formatTime(audio.currentTime);
                if (miniDuration) miniDuration.textContent = formatTime(audio.duration);
                localStorage.setItem("currentTime", audio.currentTime);
            }
        });

        audio.addEventListener("loadedmetadata", () => {
            if (miniDuration) miniDuration.textContent = formatTime(audio.duration);
        });
    }

    if (playlistPage) {
        playlistPage.addEventListener("click", (e) => {
            let target = e.target;
            let isControlElement = false;

            if (target.id === 'importBtn' || target.closest('#importBtn')) {
                return;
            }

            while (target && target !== playlistPage) {

                if (
                    target.tagName === 'LI' ||
                    target.id === 'playBtn' ||
                    target.id === 'prevBtn' ||
                    target.id === 'nextBtn' ||
                    target.id === 'importBtn' ||
                    target.id === 'fileInput'
                ) {
                    isControlElement = true;
                    break;
                }

                target = target.parentNode;
            }
            if (!isControlElement) {
                if (audio) {
                    localStorage.setItem("trackIndex", currentTrack);
                    localStorage.setItem("currentTime", audio.currentTime);
                    localStorage.setItem("isPlaying", !audio.paused);
                }
                window.location.href = 'index.html';
            }
        });
    }

    if (miniPlayer) {
        miniPlayer.addEventListener("click", (e) => {
            let target = e.target;
            let isButton = false;

            while (target && target !== miniPlayer) {
                if (target.tagName === 'BUTTON') {
                    isButton = true;
                    break;
                }
                target = target.parentNode;
            }

            if (!isButton) {
                if (audio) {
                    localStorage.setItem("trackIndex", currentTrack);
                    localStorage.setItem("currentTime", audio.currentTime);
                    localStorage.setItem("isPlaying", !audio.paused);
                }
                window.location.href = 'index.html';
            }
        });
    }
}

window.addEventListener("beforeunload", () => {
    if (audio) {
        localStorage.setItem("trackIndex", currentTrack);
        localStorage.setItem("currentTime", audio.currentTime);
        localStorage.setItem("isPlaying", !audio.paused);
        localStorage.setItem("volume", audio.volume);
    }
    saveTracksToLocal();
});