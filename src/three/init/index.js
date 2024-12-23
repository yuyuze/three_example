import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function init (target) {
    const scene = new THREE.Scene();
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    renderer.setAnimationLoop( animate );
    camera.position.z = 5;
    // 控制器
    const controls = new OrbitControls( camera, renderer.domElement );
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    target.appendChild( renderer.domElement );

    function animate() {
        renderer.render( scene, camera );
        controls.update();
    }
}
export default init;
