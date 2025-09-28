console.log("lets start");
let currentSongs = new Audio();
let songs;

app.use(express.static('songs'))

function secondstominutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingsec = Math.floor(seconds % 60);

  const formattedmin = String(minutes).padStart(2, "0");
  const fromattedsec = String(remainingsec).padStart(2, "0");
  return `${formattedmin}:${fromattedsec}`;
}

async function gettingMusic() {
  let a = await fetch(
    "songs"
  );
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  // for (let index = 0; index < as.length; index++) {
  //     const element = as[index];
  //     if(element.href.endsWith(".mp3")){
  //         songs.push(element.href)
  //     }
  // }
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    let text = element.textContent.trim(); // ✅ get the visible file name

    if (text.endsWith(".mp3")) {
      // ✅ always rebuild clean URL
      let cleanUrl = `http://127.0.0.1:3000/web%20development/project/Music%20player%20clone/songs/${encodeURIComponent(
        text
      )}`;
      songs.push(cleanUrl.split("/songs/")[1].split("(")[0]);
    }
  }
  return songs;
}

gettingMusic();

const playmusic = (track , pause =false) => {
  // let audio = new Audio("songs/" + track);
  currentSongs.src = "http://127.0.0.1:3000/web%20development/project/Music%20player%20clone/songs/" + track;
  if(!pause){
    currentSongs.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songkonsa").innerHTML = decodeURI(track);
  document.querySelector(".timekitna").innerHTML = "00:00 / 00:00";
};

// const playmusic = (trackUrl) => {
//   let audio = new Audio(trackUrl);
//   audio.play().catch(err => console.error("Play error:", err));
// }

async function main() {
  
  // Getting list of all the songs
  songs = await gettingMusic();
  playmusic(songs[0],true)
  console.log(songs);

  let songUl = document
    .querySelector(".musicplay")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="39"
                    height="24"
                    color="#ffffff"
                    fill="none"
                  >
                    <path
                      d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                      stroke="#ffffff"
                      stroke-width="1.5"
                    ></path>
                    <path
                      d="M10 15.5C10 16.3284 9.32843 17 8.5 17C7.67157 17 7 16.3284 7 15.5C7 14.6716 7.67157 14 8.5 14C9.32843 14 10 14.6716 10 15.5ZM10 15.5V11C10 10.1062 10 9.65932 10.2262 9.38299C10.4524 9.10667 10.9638 9.00361 11.9865 8.7975C13.8531 8.42135 15.3586 7.59867 16 7V13.5M16 13.75C16 14.4404 15.4404 15 14.75 15C14.0596 15 13.5 14.4404 13.5 13.75C13.5 13.0596 14.0596 12.5 14.75 12.5C15.4404 12.5 16 13.0596 16 13.75Z"
                      stroke="#ffffff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <div class="naam">
                    <div class="songnme">${song.replaceAll("%20", " ")}</div>
                    <div class="artis">Artist Name</div>
                  </div>
                  <div class="playnow">
                    <p>Play Now</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="39"
                      height="24"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#ffffff"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
              </li>`;
  }

  // // Playing the first song
  // var audio = new Audio(songs[0]);
  // // audio.play();

  // audio.addEventListener("loadeddata" , () =>{
  //     let duration = audio.duration;
  //     console.log(duration)
  // });

  // Lets attach event listener to each song
  Array.from(
    document.querySelector(".musicplay").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".songnme").innerHTML);
      playmusic(e.querySelector(".songnme").innerHTML);
    });
  });

  // Lets attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSongs.paused) {
      currentSongs.play();
      play.src = "pause.svg";
    } else {
      currentSongs.pause();
      play.src = "play.svg";
    }
  });

  // Lets add song time for playing
  currentSongs.addEventListener("timeupdate", () => {
    // console.log(currentSongs.currentTime , currentSongs.duration);
    document.querySelector(".timekitna").innerHTML = `${secondstominutes(
      currentSongs.currentTime
    )}/${secondstominutes(currentSongs.duration)}`;
    document.querySelector(".dot").style.left = (currentSongs.currentTime / currentSongs.duration)*100 + "%";
  });

  // lets provide seeking in seekbar
  document.querySelector(".barr").addEventListener("click" , e => {
    let per = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".dot").style.left = per + "%";
    currentSongs.currentTime = ((currentSongs.duration) * per)/100;
  })

  // Add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click" , () => {
    document.querySelector(".left").style.left = "0";
  })

  // Add event listener for close
  document.querySelector(".close").addEventListener("click" , () =>{
    document.querySelector(".left").style.left = "-120%"
  })

  // Adding next and previous functionalities
  next.addEventListener("click", () =>{
    console.log("next clicked");
    console.log(songs.indexOf(currentSongs.src.split("/").slice(-1)[0]))
    let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
    if((index +1) <= songs.length-1){
      playmusic(songs[index+1]);
    }
  })
  previous.addEventListener("click", () =>{
    console.log("next clicked");
    console.log(songs.indexOf(currentSongs.src.split("/").slice(-1)[0]))
    let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
    if((index -1) >= 0){
      playmusic(songs[index-1]);
    }
  })
}

main();







