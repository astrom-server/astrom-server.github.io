
if (typeof orientation_callbacks == "undefined") {
    orientation_callbacks = []
}
orientation_callbacks.push(
    (coords) => {
        console.log(coords)
        camera.rotation.setFromVector3(new THREE.Vector3(coords.beta, coords.gamma, coords.alpha).multiplyScalar(Math.PI/180))
    }
)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.style.margin = 0

for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    const pos = new THREE.Vector3(Math.random(), Math.random(), Math.random()).subScalar(0.5).normalize().multiplyScalar(5);
    cube.position.copy(pos)
    scene.add( cube );
}

function animate() {
	requestAnimationFrame( animate );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
	renderer.render( scene, camera );
}
animate();