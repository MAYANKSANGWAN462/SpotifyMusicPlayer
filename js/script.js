let currentfolder;
let songs;

// let currentsong;
let currentsong = new Audio(); //defined in order to run one music at a single time
//code for the time duration 
function formatTime(seconds) {
    // Remove the decimal part and convert to an integer
    const totalSeconds = Math.floor(seconds);

    // Calculate the number of minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Calculate the remaining seconds
    const remainingSeconds = totalSeconds % 60;

    // Pad the seconds with a leading zero if necessary
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time string
    return `${minutes}:${paddedSeconds}`;
}
async function getSongs(folder) {
    currentfolder = folder;
    let a = await fetch(`/${currentfolder}/`);
    let response = await a.text();
    // console.log(response); //will bring the whole html which contains the data also which is fetched
    let ele = document.createElement("div");
    ele.innerHTML = response; //added the responses to the elememt which is created which is div in this case
    let as = ele.getElementsByTagName("a"); //now we want to look what inside the anchor tag from the data which we stored in the element created which was div 
    console.log(as); //printing the data we obtained in the console
    //now we will be finding those anchor tag which contains of the songs and for that we will be using the basic if else statement and apply the for loop to read each character of the href in the anchor tag
    songs = []; //here we are pushing all the .mp3 ends with file into the the array named songs which is initially empty
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            //songs.push(element.href); //this is returning the whole link but in order to get the name of the song 
            //we will be using the split keyword which will split the before link and after link in two array and then we can call then by giving the order which we want it can be before the string or it can be after the string
            songs.push(element.href.split(`/${currentfolder}/`)[1])
        }
    }
    /////////////////////////////////////
    //this portion is bring here as to populate the songs in the function we have written this code outside the getsong() function so now in order to populate the songs we have bring that code which bring the song name and also feed the songs into the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // console.log(songul); // here songul is containing the information about the songs with are going to be shown in the song list 
    // so we will be updating the songul each time the user click on the folder by making it empty 
    songul.innerHTML = "";
    // console.log(songul.innerHTML);  //it contains of the text which is container in the ul tag before running of the for of loop
    for (const song of songs) { //it will be used for adding the song name in the form of the array so we used the for of loop  here it will add all the songs
        songul.innerHTML = songul.innerHTML + `<li>
                            <img src="img/musiclogo.svg" class="invert" alt="musiclogo">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Mayank</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" width="45px" alt="play button">

                            </div></li>`;
    }

    //attached an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", ((elementt) => {
            console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
            playmusic(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML.trim());
        }))
    })
    ///////////////////////////////////////////////
    return songs;
}

const playmusic = ((track, pause = false) => {
    // let audio = new Audio("/SPOTIFY%20CLONE/songs/" + track);
    currentsong.src = `/${currentfolder}/` + track;
    if (!pause) { //using this we will be able to get the songs on the refresh only we not have to click on the playlist to load the song
        currentsong.play();
        playy.src = "img/pause1.svg"; //using this when we are clicking on the song then in the player there should be the pause button come instead of the play button 
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track); //this decodeURI is added later because earlier on adding the automatic get one song in player then the song name is disturbing so in order to handle the encoded url we have decoded the url
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
})
////////////////////////////////////////////////////////////////////////////
// async function displayalbums() {
//     console.log("displaying albums")
//     let a = await fetch(`/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let CardContainer = document.querySelector(".card-container")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/songs/${folder}/info.json`)
//             let response = await a.json(); 
//             //now the information about the folder we gathered we will put it into the cardcontainer code
//             CardContainer.innerHTML = CardContainer.innerHTML + `<div data-folder="${folder}" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
//                                 <!-- Circle background -->
//                                 <circle cx="24" cy="24" r="24" fill="#1ed760" />
//                                 <!-- Play button -->
//                                 <path
//                                     d="M30.8906 24.846C30.5371 26.189 28.8667 27.138 25.5257 29.0361C22.296 30.8709 20.6812 31.7884 19.3798 31.4196C18.8418 31.2671 18.3516 30.9776 17.9562 30.5787C17 29.6139 17 27.7426 17 24C17 20.2574 17 18.3861 17.9562 17.4213C18.3516 17.0224 18.8418 16.7329 19.3798 16.5804C20.6812 16.2116 22.296 17.1291 25.5257 18.9639C28.8667 20.862 30.5371 21.811 30.8906 23.154C31.0365 23.7084 31.0365 24.2916 30.8906 24.846Z"
//                                     stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
//                             </svg>
//                         </div>
//                         <img src="songs/${folder}/cover.jpeg" alt="viralhits">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`;
//         }
//     }
////////////////////////////////////////////////////////////////////////////
async function displayalbums() {
    let a = await fetch(`/songs/`);  //here slash
    let response = await a.text();
    let ele = document.createElement("div");
    ele.innerHTML = response;
    // console.log(ele);
    let CardContainer = document.querySelector(".card-container");
    let anchors = ele.getElementsByTagName("a");
    
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) { //we have used the traditional for loop instead of using the foreach 
        // loop because in foreach loop the code below is running in the background as 
        // array.from is using the async function and all the work is being done in the 
        // background thats why in order to handle it we have used the traditional 
        // for loop instead of the foreach loop
        const e = array[index];
        //we not have to target here as it is not the event 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folderr = e.href.split("/").slice(-2)[0]
            // console.log(e.href.split("/").slice(-1)[0])
            // console.log(folderr);
            //get the meta data of the folder
            let a = await fetch(`songs/${folderr}/info.json`);
            let response = await a.json();
            console.log(response);
            //now the information about the folder we gathered we will put it into the cardcontainer code
            CardContainer.innerHTML = CardContainer.innerHTML + `<div data-folder="${folderr}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
                                <!-- Circle background -->
                                <circle cx="24" cy="24" r="24" fill="#1ed760" />
                                <!-- Play button -->
                                <path
                                    d="M30.8906 24.846C30.5371 26.189 28.8667 27.138 25.5257 29.0361C22.296 30.8709 20.6812 31.7884 19.3798 31.4196C18.8418 31.2671 18.3516 30.9776 17.9562 30.5787C17 29.6139 17 27.7426 17 24C17 20.2574 17 18.3861 17.9562 17.4213C18.3516 17.0224 18.8418 16.7329 19.3798 16.5804C20.6812 16.2116 22.296 17.1291 25.5257 18.9639C28.8667 20.862 30.5371 21.811 30.8906 23.154C31.0365 23.7084 31.0365 24.2916 30.8906 24.846Z"
                                    stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="songs/${folderr}/cover.jpeg" alt="viralhits">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }
    //we will write the code for the loading the playlist here so that we do it in a single function
    //laod the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", (async (item) => {
            //target will target the value to which we are pointing to using the pointer
            //while the currentarget will target the property on which the event listener is applied as the click event is applied on the card then if we now point anywhere whether on the image of the headings etc it will point to the card and not to the specific image or the specific heading etc
            console.log(item.target, item.currentTarget.dataset);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            //item.dataset.folder; //now here we need the folder to load and that was made earlier  ,  this line load the folder --> songs = await getSongs("songs/ncs");
            playmusic(songs[0]); //in order to play the first song as the user clicks on the card 
        }))
    })

}






async function main() {
    songs = await getSongs("songs/ncs");
    // console.log(songs);
    playmusic(songs[0], true)


    //display all the albums on the page
    await displayalbums();

}

//attach and even listener in play,next and previous
// added an eventlistener to the play pause button where we have given the id as playy
playy.addEventListener("click", (() => {
    if (currentsong.paused) {
        currentsong.play();
        playy.src = "img/pause1.svg";
    }
    else {
        currentsong.pause();
        playy.src = "img/play.svg";
    }
}))

//listen for the time update event
currentsong.addEventListener("timeupdate", (() => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
}))

//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", ((e) => {
    console.log(e.target.getBoundingClientRect().width, e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
}))

//add an even listener for the hamburg functionality
document.querySelector(".hamburger").addEventListener("click", (() => {
    document.querySelector(".left").style.left = "0";

}))
//adding an event listener for closing the hamburg functionality
document.querySelector(".close").addEventListener("click", (() => {
    document.querySelector(".left").style.left = "-110" + "%";

}))

//adding an event listener to the previous button
previouss.addEventListener("click", (() => {
    console.log("previous clicked");
    console.log(currentsong.src.split("/").slice(-1)[0]);
    let indexx = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs, indexx);
    if ((indexx - 1) >= 0) { //here songs.length will return the size of the array means no. of element array 
        playmusic(songs[indexx - 1]);
    }

}))
//adding an event listener to the next button
nextt.addEventListener("click", (() => {
    console.log("next clicked");
    // console.log(currentsong.src.split("/")[5].replaceAll("%20" , " "));
    // let indexxx = songs.indexOf(currentsong.src.split("/")[5].replaceAll("%20" , " "));
    // console.log(songs , indexxx); //here the index of the song is not coming correct
    console.log(currentsong.src.split("/").slice(-1)[0]);
    let indexx = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs, indexx);

    if ((indexx + 1) < songs.length) { //here songs.length will return the size of the array means no. of element array 
        playmusic(songs[indexx + 1]);
    }
}))
//now adding a volume changement controller
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", ((e) => {
    console.log(e, e.target, e.target.value);
    currentsong.volume = parseInt(e.target.value) / 100; //because volume takes the number between the 0 to 1
}))
//add the event listener to mute the track
document.querySelector(".volume > img").addEventListener("click", ((e) => {
    // console.log(e.target.src.replace("volume.svg" , "mute.svg"));
    if (e.target.src.includes("volume.svg")) {
        // e.target.src.replace("volume.svg" , "mute.svg"); //as string are immuatable so we cannot directly change it 
        // for this we have to do like this
        e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else {
        e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
        currentsong.volume = 0.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
    }
}))


main();

