

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


random_food()