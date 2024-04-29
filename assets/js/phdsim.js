import { FontLoader } from "./FontLoader.js";
import { TextGeometry } from "./TextGeometry.js";







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


var player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
scene.add(player)
player.add(camera)
camera.position.set(0,0,10)


var keysdown = []
document.addEventListener('keydown', (event) => {
    if (!keysdown.includes(event.key)) keysdown.push(event.key)
})
document.addEventListener('keyup', (event) => {
    keysdown.splice(keysdown.indexOf(event.key), 1)
})





let animation_lastTime = Date.now()
const particle_cooldown = {'last': 0, 'max': 100}
function animate() {
    let deltaTime = (Date.now() - animation_lastTime) / 1000
    animation_lastTime = Date.now()

    set_star_color(Date.now()/1000)
    

    var vel_x = 0
    var vel_y = 0
    for (const key of keysdown) {
        if (key == 'w') vel_y += 1
        else if (key == 's') vel_y -= 1
        else if (key == 'a') vel_x -= 1
        else if (key == 'd') vel_x += 1
    }
    const speed = 20
    player.position.add((new THREE.Vector3(vel_x, vel_y, 0)).normalize().multiplyScalar(speed*deltaTime))

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()

	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();
