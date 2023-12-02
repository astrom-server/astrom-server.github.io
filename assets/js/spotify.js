

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
                    document.getElementsByTagName("body")[0].style.setProperty("--background-url",  "url(" + album_cover.url + ")")
                    document.getElementById("song_name").innerHTML = pick.name
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




authorize()