// Song list (you can replace with your own)
const songs = [
  {
    title: "Kesariya",
    artist: "Arijit Singh",
    src: "songs/kesariya.mp3",
    cover: "https://wallpapercave.com/wp/wp12012410.jpg"
  },
  {
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    src: "songs/apnabanale.mp3",
    cover: "https://wallpapercave.com/wp/wp12012410.jpg"
  },
  {
    title: "Tera Yaar Hoon Main",
    artist: "Arijit Singh",
    src: "songs/terayaar.mp3",
    cover: "https://wallpapercave.com/wp/wp12012410.jpg"
  }
];

// Audio setup
let currentIndex = 0;
let audio = new Audio(songs[currentIndex].src);
let isPlaying = false;

// Elements
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const songTitle = document.querySelector(".songkonsa");
const timeDisplay = document.querySelector(".timekitna");
const progressBar = document.querySelector(".barr");
const progressDot = document.querySelector(".dot");

// Load first song
function loadSong(index) {
  audio.src = songs[index].src;
  songTitle.innerText = `${songs[index].title} - ${songs[index].artist}`;
  updateProgress(0);
}
loadSong(currentIndex);

// Play/Pause Toggle
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playBtn.src = "play.svg";
  } else {
    audio.play();
    playBtn.src = "pause.svg";
  }
  isPlaying = !isPlaying;
});

// Next Song
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  audio.play();
  playBtn.src = "pause.svg";
  isPlaying = true;
});

// Previous Song
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audio.play();
  playBtn.src = "pause.svg";
  isPlaying = true;
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  updateProgress(progress);
  updateTime();
});

// Seek when clicking progress bar
progressBar.addEventListener("click", (e) => {
  const barWidth = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / barWidth) * duration;
});

function updateProgress(percent) {
  progressDot.style.left = `${percent}%`;
}

// Update Time Display
function updateTime() {
  let current = formatTime(audio.currentTime);
  let total = formatTime(audio.duration);
  timeDisplay.innerText = `${current} / ${total}`;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Auto next song
audio.addEventListener("ended", () => {
  nextBtn.click();
});
