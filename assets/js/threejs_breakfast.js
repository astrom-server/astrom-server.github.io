import { FontLoader } from "./FontLoader.js";
import { TextGeometry } from "./TextGeometry.js";



// ------------------------------------------ GYRO ------------------------------------------
if (typeof motion_callbacks == "undefined") {
    motion_callbacks = []
}
motion_callbacks.push(
    (coords) => {
        const rot = camera.quaternion.clone();
        const x_ax = new THREE.Vector3(1, 0, 0).applyQuaternion(rot)
        const y_ax = new THREE.Vector3(0, 1, 0).applyQuaternion(rot)
        const z_ax = new THREE.Vector3(0, 0, 1).applyQuaternion(rot)
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(x_ax, coords.d_alpha*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(y_ax, coords.d_beta*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(z_ax, coords.d_gamma*Math.PI/180)); 
        camera.updateMatrix()
    }
)





// ------------------------------------------ THREE JS ------------------------------------------
const BACKGROUND_COLOR = new THREE.Color(1, 0.8, 0.8)
const DISC_COLOR = new THREE.Color(255/255, 229/255, 180/255)


//Setup
const scene = new THREE.Scene();
scene.background = BACKGROUND_COLOR
window.scene = scene
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// STARS
var positions = new Array(0);
var colors = new Array(0);
for ( var i = 0; i < 10000; i ++ ) {
    let x = (0.5 - Math.random())*2000;
    let y = (0.5 - Math.random())*2000;
    let z = (0.5 - Math.random())*2000;
    let d = x*x + y*y + z*z
    while (d < 2500) {
        x = (0.5 - Math.random())*2000;
        y = (0.5 - Math.random())*2000;
        z = (0.5 - Math.random())*2000;
        d = x*x + y*y + z*z
    }
    positions.push(x, y, z);
    colors.push(Math.random(), Math.random(), Math.random());
}
var starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute(
    "position", new THREE.Float32BufferAttribute(positions, 3)
);
starsGeometry.setAttribute(
    "color", new THREE.Float32BufferAttribute(colors, 3)
);
var starsMaterial = new THREE.PointsMaterial( { size: 1,  vertexColors: true } );
var starField = new THREE.Points( starsGeometry, starsMaterial );
scene.add( starField );
function set_star_color(t) {
    let colors = []
    for ( var i = 0; i < 10000; i ++ ) {
        const s = (Math.sin(t + i) + 1)/2
        colors.push(s, s*0.8, s*0.8);
    }
    starField.geometry.setAttribute(
        "color", new THREE.Float32BufferAttribute(colors, 3)
    );
}
set_star_color(0)

const word_stars = []



const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener( 'click', ( event ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycast()
});

let words = {}
function raycast() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

    if (intersects.length == 0) return

    let object = intersects[0].object
    while (object.parent && object.userData.word == undefined) {
        object = object.parent
    }
    const word = object.userData.word
    const cat = object.userData.cat
    console.log(word)
    words[cat] = word
    check_search_enabled()
    console.log(words)
	renderer.render( scene, camera );

}

const fonts = []
const loader = new FontLoader();
loader.load( '../assets/fonts/Albertus MT Std_Regular (1).json', function ( font ) {
    fonts.push(font)
} );

let fetching = false
let word_list;
function load_json(callback) {
    if (fetching) return
    fetching = true
    var client = new XMLHttpRequest();
    client.open('GET', '/assets/food_recipes.json');
    client.onreadystatechange = function() {
        console.log(client)
        if (client.readyState == 4) {
            word_list = JSON.parse(client.responseText)
            console.log(word_list)
            callback()
        }
    }
    client.send()
}
function random_word() {
    let cats = Object.keys(word_list)
    let cat = cats[Math.floor(Math.random()*cats.length)]
    let cat_words = word_list[cat]
    let word = cat_words[Math.floor(Math.random()*cat_words.length)]
    return [cat, word]
}

function add_star() {
    if (!word_list) {
        console.log("reading")
        load_json(() => add_star())
        return
    }
    let geometry = new THREE.CircleGeometry( 5, 32 ); 
    let material = new THREE.MeshBasicMaterial( { color: DISC_COLOR, transparent: true} ); 
    let circle = new THREE.Mesh( geometry, material );

    const group = new THREE.Group()
    group.add(circle)
    let pos = new THREE.Vector3(Math.random(), Math.random(), Math.random()).subScalar(0.5).normalize().multiplyScalar(50);
    
    let valid = true
    for (const particle of word_stars) {
        if (particle.position.distanceTo(pos) < 10) return
    }
    //pos = new THREE.Vector3(0, 0, -50)
    group.position.copy(pos)
    group.lookAt(new THREE.Vector3())
    
    if (fonts.length > 0) {
        
        let res = random_word()
        let cat = res[0]
        let word = res[1]

        geometry = new TextGeometry( word, {
            font: fonts[0],
            size: 15,
            height: 5,
            curveSegments: 12,
        });
        material = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 0, 0), transparent: true } ); 
        let text = new THREE.Mesh( geometry, material );
        text.geometry.computeBoundingBox()
        let bb = text.geometry.boundingBox
        text.geometry.translate(-bb.max.x/2,-bb.max.y/2,0)
        let size = bb.getSize(new THREE.Vector3())
        text.scale.multiplyScalar(8/3/Math.max(size.x/3, size.y))

        group.userData.word = word
        group.userData.cat = cat
        group.add(text)
    }

    group.userData.startTime = Date.now()
    group.userData.lifeTime = 10000
    word_stars.push(group)
    scene.add( group );
}


let animation_lastTime = Date.now()
const particle_cooldown = {'last': 0, 'max': 100}
function animate() {
    let deltaTime = (Date.now() - animation_lastTime) / 1000
    animation_lastTime = Date.now()

    set_star_color(Date.now()/1000)

    if (Date.now() - particle_cooldown.last > particle_cooldown.max) {
        particle_cooldown.last = Date.now()
        add_star()
    }

    for (let i = word_stars.length-1; i >= 0; i--) {
        const particle = word_stars[i];
        const t = (Date.now() - particle.userData.startTime)/particle.userData.lifeTime;
        let op = Math.sin(Math.PI*t)
        for (const child of particle.children) {
            child.material.opacity = op;
        }
        if (t > 1) {
            scene.remove(particle);
            word_stars.splice(i, 1);
        }
    }

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()

	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();



// ------------------------------------------ SPOTIFY ------------------------------------------
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

authorize()


let search_btn = document.createElement('button')
search_btn.id = 'search_button'
document.getElementsByClassName("wrapper")[0].appendChild(search_btn)
search_btn.addEventListener( 'click', () => {

    if (Object.keys(words) == 0) return;

    
    const http = new XMLHttpRequest();
    let url = 'https://api.edamam.com/api/recipes/v2?';
    url += "type=public";
    //url += "&q=" + encodeURI(query);
    url += "&app_id=f62dad68&app_key=0a17b974cab533977f808315f73de41b";
    url += "&health=vegetarian";
    url += "&random=true";


    for (const cat in words) {
        url += "&" + cat + "=" + words[cat]
    }

    words = {}
    check_search_enabled()

    console.log(url)
    http.open("GET", url);
    http.setRequestHeader('Accept', 'application/json');
    http.setRequestHeader('Accept-Language', 'en');
    http.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.response) {
            let response = JSON.parse(event.target.response)
            console.log(response)
            if (response.hits.length == 0) {
                SetFood(-1)
                console.log("ERROR NONE FOUND", response)
                return
            }
            let done = false
            for (const pick of response.hits) {
                if (pick != null && pick.recipe && pick.recipe.image != null) {
                    SetFood(pick)
                    done = true
                    break;
                }
            }
            if (!done) {
                SetFood(-1)
                console.log("ERROR NO IMAGE FOUND", response)
                return
            }
        } else if (event.target.status == 400) {
            console.error(event.target)
        }
    }
    http.onerror = (event) => {
        console.log(event)
    }
    http.send();
});

function check_search_enabled() {

    if (Object.keys(words).length == 0) {
        search_btn.innerHTML = "What are you in the mood for?"
    } else {
        search_btn.innerHTML = `Search<br>(${Object.values(words).join(" ")})`
    }
}
check_search_enabled()


document.getElementById("song_cover").addEventListener("load", () => {
    set_song_visible(true)
    setTimeout(() => {
        const title = document.getElementById("song_title")
        //title.style.fontSize = "calc(min(4vw, 4vh)*" + title.clientWidth/title.scrollWidth + ")"
    }, 50)
})
document.getElementById("song_cover").addEventListener("click", () => {
    if (current_recipe != null && current_recipe.recipe.url != "") {
        window.open(current_recipe.recipe.url);
    }
})
document.getElementById("close_button").addEventListener("click", () => {
    set_song_visible(false)
})
function set_song_visible(visible) {
    let vis = "block"
    if (!visible) vis = "none"
    document.getElementById("song_display").style.display = vis
    document.getElementById("song_cover").style.display = vis
    document.getElementById("song_title").style.display = vis
    document.getElementById("close_button").style.display = vis
    document.getElementById("song_artist").style.display = vis
} 
let current_recipe = null;
function SetFood(pick) {
    if (pick == -1) {
        pick = {
            'recipe': {
                'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sad_face.svg/603px-Sad_face.svg.png',
                'label': 'No recipe found',
                'source': 'your brother',
                'url': ''
            }
        }
    }
    current_recipe = pick
    if (pick == null) {
        set_song_visible(false)
        return 
    }
    console.log(pick)
    document.getElementById("song_cover").src = pick.recipe.image
    const title = document.getElementById("song_title")
    title.innerHTML = pick.recipe.label//.toUpperCase()
    title.style.fontSize = "min(4vw, 4vh)"
    document.getElementById("song_artist").innerHTML = "by " + pick.recipe.source.toUpperCase()
}
