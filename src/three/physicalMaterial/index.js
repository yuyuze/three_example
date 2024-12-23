import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function init(target) {
  const scene = new THREE.Scene();
  const width = target.offsetWidth;
  const height = target.offsetHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(width, height);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const thicknessMap = new THREE.TextureLoader().load(
    '/texture/diamond/diamond_emissive.png'
  );
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    thickness: 0.1,
    transmission: 1,
    iridescence: 1, // 虹彩
    reflectivity: 1, // 折射率
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400], // 纳米
    iridescenceMap: thicknessMap,
    // transparent: true,
    // transmission: 0.95, //     透明图
    // roughness: 0.05, // 粗糙度
    // thickness: 2, // 厚度
    // thicknessMap: thicknessMap,
    // attenuationColor: new THREE.Color(0.6, 0.8, 0), // 衰减颜色
    // attenuationDistance: 1, // 衰减距离 就是光结束的距离, 与厚度有关
  });
  let gui = new GUI();
  gui.add(material, 'iridescence', 0, 1).name('彩虹色');
  gui.add(material, 'reflectivity', 0, 1).name('反射');
  gui.add(material, 'iridescenceIOR', 0, 3).name('虹彩折射率');
  // 用厚度贴图实现不同的厚度的物体
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const ambientLight = new THREE.AmbientLight({
    color: 0xffffff,
    intensity: 10,
  });
  scene.add(ambientLight);
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(
    '/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',
    function (envMap) {
      scene.environment = envMap;
      scene.background = envMap;
      // hdr作为环境贴图生效，设置.mapping为EquirectangularReflectionMapping
      envMap.mapping = THREE.EquirectangularReflectionMapping;
    }
  );
  renderer.setAnimationLoop(animate);
  camera.position.z = 5;
  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  target.appendChild(renderer.domElement);

  function animate() {
    renderer.render(scene, camera);
    controls.update();
  }
}
export default init;

// 不断创建物体的时候
// 清除几何 清除材质 清除纹理 移除物体 dispose scene.remove
