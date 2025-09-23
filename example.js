console.log("🎵 Music Player Loaded (robust fetch)");

let songs = [];
let currentIndex = 0;
const audio = new Audio();
let isPlaying = false;

// Elements (adjust selectors if your markup differs)
const songListEl = document.querySelector(".music ul");
const artistEl = document.querySelector(".artis");
const titleEl = document.querySelector(".songnme");
const playBtn = document.querySelector(".playnow svg");
const prevBtn = document.querySelector(".controls svg:nth-child(1)");
const mainPlayBtn = document.querySelector(".controls svg:nth-child(2)");
const nextBtn = document.querySelector(".controls svg:nth-child(3)");
const barEl = document.querySelector(".barr");
const dotEl = document.querySelector(".dot");

// Base URL (change if your server runs on a different host/port)
const BASE = "http://127.0.0.1:3000/web%20development/project/Music%20player%20clone/songs/";

async function fetchJSON(url) {
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  // If not ok, show response text to console for debugging
  if (!res.ok) {
    const text = await res.text();
    console.error(`Fetch ${url} failed:`, res.status, text.slice(0, 500));
    throw new Error(`Fetch failed: ${res.status}`);
  }

  // If server didn't return JSON, dump the first few chars (likely HTML)
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error(`Expected JSON from ${url} but got:`, text.slice(0, 800));
    throw new Error("Server returned non-JSON response. Check the URL and server.");
  }

  return res.json();
}

async function loadSongs() {
  try {
    // try the most likely file URL first
    songs = await fetchJSON(`${BASE}/songs.json`);
  } catch (err1) {
    console.warn("Could not load /songs.json — trying /songs as fallback.", err1);
    try {
      songs = await fetchJSON(`${BASE}/songs`);
    } catch (err2) {
      console.error("Failed to load songs from server. Open devtools -> Network to inspect the response.", err2);
      songListEl.innerHTML = '<li style="color:#f33">Error loading songs — see console.</li>';
      return;
    }
  }

  if (!Array.isArray(songs) || songs.length === 0) {
    console.error("songs.json did not return an array or is empty.", songs);
    songListEl.innerHTML = '<li style="color:#f33">No songs found in songs.json</li>';
    return;
  }

  // Populate UI list
  songListEl.innerHTML = "";
  songs.forEach((song, index) => {
    let li = document.createElement("li");
    li.textContent = `${song.title} — ${song.artist}`;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      loadSong(index);
      audio.play();
    });
    songListEl.appendChild(li);
  });

  // load first song
  loadSong(0);
}

function loadSong(index) {
  if (!songs[index]) return;
  currentIndex = index;
  audio.src = songs[index].file;
  artistEl.textContent = songs[index].artist || "Unknown artist";
  titleEl.textContent = songs[index].title || "Unknown title";

  // update selected class in list
  Array.from(songListEl.children).forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

function togglePlay() {
  if (!audio.src) return;
  if (isPlaying) audio.pause();
  else audio.play();
}

// UI reaction to audio state
audio.addEventListener("play", () => {
  isPlaying = true;
  // change visuals - keep simple
  playBtn && playBtn.classList.add("playing");
  mainPlayBtn && mainPlayBtn.classList.add("playing");
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn && playBtn.classList.remove("playing");
  mainPlayBtn && mainPlayBtn.classList.remove("playing");
});

// progress bar update
audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !dotEl || !barEl) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  dotEl.style.left = pct + "%";
});

// seek on click
barEl && barEl.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = barEl.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newTime = (clickX / rect.width) * audio.duration;
  audio.currentTime = newTime;
});

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  audio.play();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audio.play();
}

playBtn && playBtn.addEventListener("click", togglePlay);
mainPlayBtn && mainPlayBtn.addEventListener("click", togglePlay);
nextBtn && nextBtn.addEventListener("click", nextSong);
prevBtn && prevBtn.addEventListener("click", prevSong);

audio.addEventListener("ended", nextSong);

// Start
loadSongs();
