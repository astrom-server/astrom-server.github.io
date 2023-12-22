


function call(path, callback) {

    const http = new XMLHttpRequest();
    const url = 'https://www.dnd5eapi.co' + path;
    http.open("GET", url);
    http.setRequestHeader('Accept', 'application/json');
    http.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.response) {
            let response = JSON.parse(event.target.response)
            callback(response)
        } else if (event.target.status == 400) {
            console.error(event.target)
        }
    }
    http.onerror = (event) => {
        console.log(event)
    }
    http.send();
}

function fill_search() {
    const select = document.getElementById("monster_search");
    while (select.childNodes.length > 0) select.removeChild(select.childNodes[0])
    opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Guess a Monster...";
    select.appendChild(opt);
    for (const name in monster_dict) {
        if (search_history.includes(name)) continue
        opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    }
}

let monster_dict = {}
let monster_count = 0;
const monster_queue = []
function load_monsters_2() {
    var client = new XMLHttpRequest();
    client.open('GET', '/assets/monsters.json');
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            monster_dict = JSON.parse(client.responseText)

            delete monster_dict["Cloud Giant"]

            fill_search()
            
            $(document).ready(function () {
                //change selectboxes to selectize mode to be searchable
                $("select").select2();
            });

            set_random_monster()
        }
    }
    client.send();
}
load_monsters()

function load_monsters() {
    $(document).ready(function () {
        //change selectboxes to selectize mode to be searchable
        $("select").select2();
    });
    call('/api/monsters', (response) => {
        console.log(response)
        monster_count = response.results.length;
        for (const monster of response.results) {
            monster_queue.push(monster.name)
            get_monster(monster.name, monster.url)
        }

    })
}

function get_monster(name, path) {
    call(path, (response) => {
        monster_dict[name] = response
        monster_queue.splice(monster_queue.indexOf(name), 1)
        document.getElementById("loading_progression").style = "width:calc(" + (1-monster_queue.length/monster_count)*100 + "% - 10px);"
        if (monster_queue.length == 0) {
            console.log("done")
            document.getElementById("loading_bar").style = "display:None"
            document.getElementById("overlay_2").style = "display:None"
            

            delete monster_dict["Cloud Giant"]

            fill_search()

            set_random_monster()
        }
    })
}

const types = ['alignment', 'challenge_rating', 'size', 'type']
const type_dict = {}
function check_monsters() {
    for (const type of types) {
        type_dict[type] = []
        for (const monster_name in monster_dict) {
            const monster = monster_dict[monster_name]
            if (!type_dict[type].includes(monster[type])) {
                type_dict[type].push(monster[type])
            }
        }
    }
    console.log(type_dict)
    return 
}

function find_monster_by_field(key, value) {
    const res = []
    for (const monster_name in monster_dict) {
        const monster = monster_dict[monster_name]
        if (monster[key] == value) res.push(monster)
    }
    return res
}

function compare_monsters(true_monster, query_monster) {
    const m1 = monster_dict[true_monster]
    const m2 = monster_dict[query_monster]

    const response = {}

    const a1 = alignment_map[m1['alignment']]
    const a2 = alignment_map[m2['alignment']]
    if (a1 == a2) response['alignment'] = 1
    else response['alignment'] = -1

    if (a1 == "any" && a2 != 'none') response['alignment'] = 0
    if (a2 == "any" && a1 != 'none') response['alignment'] = 0
    if (a1 == "notG" && !['LG', 'NG', 'CG', 'E'].includes(a2)) response['alignment'] = 0
    if (a2 == "notG" && !['LG', 'NG', 'CG', 'E'].includes(a1)) response['alignment'] = 0
    if (a1 == "notL" && !['LG', 'LN', 'LE', 'C'].includes(a2)) response['alignment'] = 0
    if (a2 == "notL" && !['LG', 'LN', 'LE', 'C'].includes(a1)) response['alignment'] = 0
    if (a1 == "C" && ['CG', 'CN', 'CE'].includes(a2)) response['alignment'] = 0
    if (a2 == "C" && ['CG', 'CN', 'CE'].includes(a1)) response['alignment'] = 0
    if (a1 == "E" && ['LE', 'NE', 'CE'].includes(a2)) response['alignment'] = 0
    if (a2 == "E" && ['LE', 'NE', 'CE'].includes(a1)) response['alignment'] = 0


    const cr1 = m1['challenge_rating']
    const cr2 = m2['challenge_rating']
    if (cr1 == cr2) response['challenge_rating'] = 0
    else if (cr1 > cr2) response['challenge_rating'] = 1
    else response['challenge_rating'] = -1

    const size_check = {
        "Tiny":0,
        "Small":1,
        "Medium":2,
        "Large":3,
        "Huge":4,
        "Gargantuan":5,
    }
    const s1 = size_check[m1['size']]
    const s2 = size_check[m2['size']]
    if (s1 == s2) response['size'] = 0
    else if (s1 > s2) response['size'] = 1
    else response['size'] = -1

    const t1 = m1['type']
    const t2 = m2['type']
    if (t1 == t2) response['type'] = 1
    else response['type'] = -1

    return response
}

document.getElementById("start_button").addEventListener("click", set_random_monster)
function set_random_monster() {
    const names = Object.keys(monster_dict)
    const i = Math.floor(Math.random()*names.length)
    const name = names[i]
    console.log(name)
    set_monster(name)
}

let current_monster = null;
let search_history = []
function set_monster(name) {
    document.getElementById("win_screen").style = "display: none";
    search_history = []
    const history = document.getElementById("search_history");
    while (history.childNodes.length > 0) history.removeChild(history.childNodes[0])
    const monster = monster_dict[name]
    console.log(monster)
    if (monster.image) {
        //document.getElementById("monster_image").src = 'https://www.dnd5eapi.co' + monster.image
    }
    current_monster = name
    document.getElementById('monster_title').innerHTML = "???"
}
function search_monster() {
    
    const name = document.getElementById("monster_search").value;
    if (name == "") return

    if (name == current_monster) {
        document.getElementById("win_screen").style = "display: block";
        document.getElementById("monster_title").innerHTML = name;
        document.getElementById("monster_name").innerHTML = name;
        return
    }
    if (Object.keys(monster_dict).includes(name)) {
        search_history.push(name)
        const monster = monster_dict[name]
        const res = compare_monsters(current_monster, name)
        console.log(monster, res)
        const history = document.getElementById("search_history");

        const item = document.createElement("div");
        item.className = "search_item";
        history.insertBefore(item, history.childNodes[0]);

        let field = document.createElement("div");
        field.className = "search_item_title search_item_content";
        field.innerHTML = name
        item.appendChild(field);

        field = document.createElement("div");
        field.className = "search_item_el search_item_content";
        let color = "green"
        if (res['alignment'] == 0) {
            color = "yellow"
        } else if (res['alignment'] == -1) {
            color = "red"
        }
        field.innerHTML = alignment_map[monster['alignment']]
        field.style = "background-color: " + color
        item.appendChild(field);

        field = document.createElement("div");
        field.className = "search_item_el search_item_content";
        let sign = ""
        color = "green"
        if (res['challenge_rating'] == -1) {
            sign = "<"
            color = "red"
        } else if (res['challenge_rating'] == 1) {
            sign = ">"
            color = "red"
        }
        field.innerHTML = sign + monster['challenge_rating']
        field.style = "background-color: " + color
        item.appendChild(field);

        field = document.createElement("div");
        field.className = "search_item_el search_item_content";
        sign = ""
        color = "green"
        if (res['size'] == -1) {
            sign = "<"
            color = "red"
        } else if (res['size'] == 1) {
            sign = ">"
            color = "red"
        }
        field.innerHTML = sign + monster['size'][0]
        field.style = "background-color: " + color
        item.appendChild(field);

        field = document.createElement("div");
        field.className = "search_item_title search_item_content";
        color = "green"
        if (res['type'] == -1) {
            color = "red"
        }
        field.style = "text-align: center; background-color: " + color
        field.innerHTML = monster['type']
        item.appendChild(field);

        fill_search()
    }
}
document.getElementById("search_button").addEventListener('click', search_monster)

//get_monsters()



document.getElementById('give_up').addEventListener('click', give_up)
document.getElementById('restart').addEventListener('click', restart_game)
function give_up() {
    document.getElementById("monster_title").innerHTML = current_monster;
    document.getElementById('give_up').style = "display: none"
    document.getElementById('restart').style = "display: block"
}
function restart_game() {
    set_random_monster()
    document.getElementById('give_up').style = "display: block"
    document.getElementById('restart').style = "display: none"
}








const alignment_map = {
    'lawful evil': "LE",
    'any alignment': 'any',
    'chaotic evil': 'CE',
    'chaotic good': 'CG',
    'lawful good': 'LG',
    'neutral': 'N',
    'lawful neutral': 'LN',
    'unaligned': 'none',
    'any non-good alignment': 'notG',
    'any non-lawful alignment': 'notL',
    'neutral evil': 'NE',
    'any chaotic alignment': 'C',
    'neutral good': 'NG',
    'chaotic neutral': 'CN',
    'any evil alignment': 'E'
}

