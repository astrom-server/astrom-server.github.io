import { FontLoader } from "./FontLoader.js";
import { TextGeometry } from "./TextGeometry.js";

if (typeof motion_callbacks == "undefined") {
    motion_callbacks = []
}
motion_callbacks.push(
    (coords) => {
        console.log(coords)
        const rot = camera.quaternion.clone();
        const x_ax = new THREE.Vector3(1, 0, 0).applyQuaternion(rot)
        const y_ax = new THREE.Vector3(0, 1, 0).applyQuaternion(rot)
        const z_ax = new THREE.Vector3(0, 0, 1).applyQuaternion(rot)
        console.log("old vel", vel)
        if (coords.a_x != 0) vel.add(x_ax.clone().multiplyScalar(coords.a_x * coords.deltaTime))
        console.log("new vel", vel)
        if (coords.a_y != 0) vel.add(y_ax.clone().multiplyScalar(coords.a_y * coords.deltaTime))
        console.log("new vel", vel)
        if (coords.a_z != 0) vel.add(z_ax.clone().multiplyScalar(coords.a_z * coords.deltaTime))
        console.log("new vel", vel)
        console.log("deltatime", coords.deltaTime)
        console.log("camera position", camera.position)
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(x_ax, coords.d_alpha*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(y_ax, coords.d_beta*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(z_ax, coords.d_gamma*Math.PI/180)); 
        camera.updateMatrix()
    }
)

let vel = new THREE.Vector3()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.style.margin = 0


const particles = []

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



function raycast() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()))

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'click', ( event ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycast()
});

const fonts = []
const loader = new FontLoader();
loader.load( '../assets/fonts/Oddly Calming_Regular.json', function ( font ) {
    fonts.push(font)
} );

let word_json;
function load_json(callback) {
    fetch('/assets/words_dictionary.json')
    .then((response) => response.json())
    .then((json) => {
        word_json = json
        callback()
    });
}

function add_star() {
    if (!word_json) {
        console.log("reading")
        load_json(() => add_star())
        return
    }
    let geometry = new THREE.CircleGeometry( 5, 32 ); 
    let material = new THREE.MeshBasicMaterial( { color: new THREE.Color(1, 1, 1), transparent: true} ); 
    let circle = new THREE.Mesh( geometry, material );

    const group = new THREE.Group()
    group.add(circle)
    let pos = new THREE.Vector3(Math.random(), Math.random(), Math.random()).subScalar(0.5).normalize().multiplyScalar(50);
    //pos = new THREE.Vector3(0, 0, -50)
    group.position.copy(pos)
    group.lookAt(new THREE.Vector3())
    
    if (fonts.length > 0) {

        const keys = Object.keys(word_json);
        let word = keys[Math.floor(Math.random()*keys.length)]

        geometry = new TextGeometry( word, {
            font: fonts[0],
            size: 15,
            height: 5,
            curveSegments: 12,
        } );
        material = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 0, 0), transparent: true } ); 
        let text = new THREE.Mesh( geometry, material );
        text.geometry.computeBoundingBox()
        let bb = text.geometry.boundingBox
        text.geometry.translate(-bb.max.x/2,-bb.max.y/2,0)
        let size = bb.getSize(new THREE.Vector3())
        text.scale.multiplyScalar(8/size.x)

        group.add(text)
    }

    group.userData.startTime = Date.now()
    group.userData.lifeTime = 10000
    particles.push(group)
    scene.add( group );
}


let animation_lastTime = Date.now()
const particle_cooldown = {'last': 0, 'max': 100}
function animate() {
    let deltaTime = (Date.now() - animation_lastTime) / 1000
    animation_lastTime = Date.now()
    //camera.position.add(vel.clone().multiplyScalar(deltaTime))

    if (Date.now() - particle_cooldown.last > particle_cooldown.max) {
        particle_cooldown.last = Date.now()
        add_star()
    }

    for (let i = particles.length-1; i >= 0; i--) {
        const particle = particles[i];
        const t = (Date.now() - particle.userData.startTime)/particle.userData.lifeTime;
        console.log(particle)
        for (const child of particle.children) {
            child.material.opacity = 1-t;
        }
        if (t > 1) {
            scene.remove(particle);
            particles.splice(i, 1);
        }
    }

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()

	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();