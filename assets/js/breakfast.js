

let access_token;

function search_food(query) {

    const http = new XMLHttpRequest();
    let url = 'https://api.edamam.com/api/recipes/v2?';
    url += "type=public";
    url += "&q=" + encodeURI(query);
    url += "&app_id=f62dad68&app_key=0a17b974cab533977f808315f73de41b";
    http.open("GET", url);
    http.setRequestHeader('Accept', 'application/json');
    http.setRequestHeader('Accept-Language', 'en');
    http.onreadystatechange = (event) => {
        console.log(event)
        if (event.target.readyState == 4 && event.target.response) {
            const response = JSON.parse(event.target.response)
            const hit = response.hits[0]
            console.log(hit)
            document.getElementsByTagName("body")[0].background = hit.recipe.image
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

function random_food() {
    if (!word_json) {
        console.log("reading")
        load_json(() => random_food())
        return
    }

    const keys = Object.keys(word_json);
    const n_words = 1;
    const words = []
    for (let i = 0; i < n_words; i++) {
        words.push(keys[Math.floor(Math.random()*keys.length)])
    }
    const query = words.join(" ")
    console.log(query)
    search_food(query)
}
document.addEventListener('click', random_food)



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
let x = 0;
let y = 0;
let v = 0.020;
function handleMotionEvent(event) {
    x += event.rotationRate.beta*v;
    y += event.rotationRate.alpha*v;

    document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(x) + "vw"
    document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(y) + "vh"
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


random_food()