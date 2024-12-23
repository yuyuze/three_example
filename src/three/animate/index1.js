import { render } from 'react-dom';
import * as THREE from 'three';
import {
  DRACOLoader,
  GLTFLoader,
  TransformControls,
} from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function init(target) {
  const scene = new THREE.Scene();
  const width = target.offsetWidth;
  let mixer;
  const height = target.offsetHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  // 设置色调映射来模拟开关灯
  renderer.toneMapping = THREE.ReinhardToneMapping;
  // 曝光程度
  renderer.toneMappingExposure = 1;
  scene.background = new THREE.Color(0xcccccc);
  renderer.setSize(width, height);
  renderer.setAnimationLoop(animate);
  camera.position.z = 6;
  camera.position.x = 3;
  camera.position.y = 2.8;
  camera.lookAt(0, 0, 0);
  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
  scene.add(ambientLight);
  target.appendChild(renderer.domElement);
  let basicScene;
  let clock = new THREE.Clock();
  function animate() {
    const delta = clock.getDelta();
    renderer.render(scene, camera);
    controls.update();
    if (mixer) {
      mixer.update(delta);
    }
  }

  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  gltfLoader.setDRACOLoader(dracoLoader);
  // gltfLoader.load('/model/huawei.glb', (gltf) => {
  //   scene.add(gltf.scene);
  //   // 动画混合器
  //   mixer = new THREE.AnimationMixer(gltf.scene);
  //   // 剪切
  //   const action = mixer.clipAction(gltf.animations[0]);
  //   action.play();
  // });
  const boxGeo = new THREE.BoxGeometry(1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
  });
  const cube = new THREE.Mesh(boxGeo, material);
  cube.name = 'cube';
  scene.add(cube);
  const gui = new GUI();
  mixer = new THREE.AnimationMixer(cube);
  const movePosition = new THREE.VectorKeyframeTrack(
    'cube.position',
    [0, 1, 2, 3, 4],
    [0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0]
  );
  const quaternion1 = new THREE.Quaternion();
  quaternion1.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
  const quaternion2 = new THREE.Quaternion();
  quaternion2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  const quaternion3 = new THREE.Quaternion();
  quaternion3.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  // 表示弧度 欧拉旋转
  // quaternion3.setFromEuler(new THREE.Euler())
  const quaternion = quaternion1
    .toArray()
    .concat(quaternion2.toArray())
    .concat(quaternion3.toArray());
  const quaternionPosition = new THREE.QuaternionKeyframeTrack(
    'cube.quaternion',
    [0, 2, 4],
    quaternion
  );
  // 创建动画剪辑 名称 持续事件 动画位置定义
  const animationClip = new THREE.AnimationClip('move', 4, [
    movePosition,
    quaternionPosition,
  ]);

  const action = mixer.clipAction(animationClip);
  action.play();
  console.log('cube', cube);
}
export default init;

// 不断创建物体的时候
// 清除几何 清除材质 清除纹理 移除物体 dispose scene.remove
