import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function init (target) {
    const scene = new THREE.Scene();
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
    });
    renderer.setSize( width, height );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const matcapTexture = new THREE.TextureLoader().load('/texture/matcaps/50332C_D98D79_955F52_AA7C6C-512px.png');
    // map:
    const matcapMaterial = new THREE.MeshMatcapMaterial( { matcap: matcapTexture } );
    // lambert作用不光滑的物体的
    const lambertMaterial = new THREE.MeshLambertMaterial();
    // const cube = new THREE.Mesh( geometry, matcapMaterial);
    const cube = new THREE.Mesh( geometry, lambertMaterial);
    cube.position.set(0, 0, 0);
    const ambientLight = new THREE.AmbientLight( {color: 0xffffff, intensity: 10 } );
    scene.add(ambientLight);
    const light = new THREE.SpotLight({color: 0xffffff, intensity: 100});
    light.position.set(1, 1, 1);
    light.lookAt(0, 0, 0);
    scene.add( cube );
    scene.add( light );
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
