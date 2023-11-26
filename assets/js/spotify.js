

let access_token;

function authorize() {
    const client_id = 'afbe9c700e0744129f9019cab4a6fa12';
    const client_secret = '7bd9f8659a3649b192a917ff9ad2e3d7';
    let bytes = new TextEncoder().encode(client_id + ':' + client_secret)
    let base64 = btoa(String.fromCodePoint(...bytes));

    var body = "grant_type=client_credentials"

    const http = new XMLHttpRequest();
    const url = 'https://accounts.spotify.com/api/token';
    http.open("POST", url);
    http.setRequestHeader('Authorization', 'Basic ' + base64)
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.response) {
            let response = JSON.parse(event.target.response)
            console.log(response)
            access_token = response.access_token
            enable_gyro()
        } else if (event.target.status == 400) {
            console.error(event.target)
        }
    }
    http.onerror = (event) => {
        console.log(event)
    }
    http.send(body);
}


function get_categories() {

    const http = new XMLHttpRequest();
    const url = 'https://api.spotify.com/v1/browse/categories';
    http.open("GET", url);
    http.setRequestHeader('Authorization', 'Bearer ' + access_token)
    http.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.response) {
            let response = JSON.parse(event.target.response)
            console.log(response)
        } else if (event.target.status == 400) {
            console.error(event.target)
        }
    }
    http.onerror = (event) => {
        console.log(event)
    }
    http.send();
}

let word_json;
function load_json(callback) {
    fetch('/assets/words_dictionary.json')
    .then((response) => response.json())
    .then((json) => {
        word_json = json
        callback()
    });
}

function random_song() {
    if (!word_json) {
        console.log("reading")
        load_json(() => random_song())
        return
    }

    const keys = Object.keys(word_json);
    const n_words = 2;
    const words = []
    for (let i = 0; i < n_words; i++) {
        words.push(keys[Math.floor(Math.random()*keys.length)])
    }
    const query = words.join(" ")
    console.log(query)
    search_song(query)
}
document.addEventListener('click', random_song)
function search_song(query) {

    const http = new XMLHttpRequest();
    let url = 'https://api.spotify.com/v1/search?';
    url += 'q=' + encodeURI(query);
    url += '&type=track'
    http.open("GET", url);
    http.setRequestHeader('Authorization', 'Bearer ' + access_token)
    http.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.response) {
            let response = JSON.parse(event.target.response)
            console.log(response)
            for (const pick of response.tracks.items) {
                if (pick.preview_url != null) {
                    let pick = response.tracks.items[0]
                    let album_cover = pick.album.images[0];
                    document.getElementsByTagName("body")[0].background = album_cover.url
                    playSound(pick.preview_url)
                    break;
                }
            }
        } else if (event.target.status == 400) {
            console.error(event.target)
        }
    }
    http.onerror = (event) => {
        console.log(event)
    }
    http.send();
}

let current_audio;
function playSound(url) {
    if (current_audio) current_audio.pause()
    current_audio = new Audio(url);
    current_audio.play();
}





console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false

function updateFieldIfNotNull(fieldName, value, precision=10){
  console.log(fieldName, value)
}
function handleOrientation(event) {
    //document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(100*event.gamma/90) + "vw"
    //document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(100*event.beta/90) + "vh"
}
let alpha = 0;
let beta = 0;
let gamma = 0;
let v = 0.020;
function handleMotionEvent(event) {
    alpha += event.rotationRate.alpha*v;
    beta += event.rotationRate.beta*v;
    gamma += event.rotationRate.gamma*v;

    document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(beta) + "vw"
    document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(alpha) + "vh"
}

function enable_gyro() {
    console.log(is_running)
    
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (is_running){
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("devicemotion", handleMotionEvent, true);
      is_running = false;
    }else{
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("devicemotion", handleMotionEvent, true);
      is_running = true;
    }
    console.log(is_running)
}


authorize()