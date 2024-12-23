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
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);
  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
  scene.add(ambientLight);
  target.appendChild(renderer.domElement);
  let basicScene;

  function animate() {
    renderer.render(scene, camera);
    controls.update();
  }

  // 创建变化控制器
  const tControls = new TransformControls(camera, renderer.domElement);
  // 改变更新视图
  tControls.addEventListener('change', animate);
  // 移动的时候，轨道控制器禁用
  tControls.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
    console.log('position', tControls.position); // 控件的局部坐标
    console.log(
      'getWorldPosition',
      tControls.getWorldPosition(new THREE.Vector3())
    ); // 控件的世界坐标
  });
  tControls.addEventListener('change', () => {
    // 是否吸附地面
    if (eventObj.isClampGroup) {
      tControls.object.position.y = 0;
    }
  });
  scene.add(tControls);

  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load('/model/house/house-scene-min.glb', (gltf) => {
    basicScene = gltf.scene;
  });
  const gui = new GUI();
  const eventObj = {
    addScene() {
      scene.add(basicScene);
    },
    setTranlate() {
      tControls.setMode('translate');
    },
    setScale() {
      tControls.setMode('scale');
    },
    setRotate() {
      tControls.setMode('rotate');
    },
    // 切换本地空间还是全局空间
    toggleSpace() {
      tControls.setSpace(tControls.space === 'local' ? 'world' : 'local');
    },
    cancelMesh() {
      tControls.detach();
    },
    translateSnapNum: null,
    rotateSnapNum: 0,
    scaleSnapNum: 0,
    isClampGroup: false,
    isLight: true,
  };
  gui.add(eventObj, 'addScene').name('添加户型基础模型');
  gui.add(eventObj, 'setTranlate').name('设置变换器平移');
  gui.add(eventObj, 'setScale').name('设置变换器缩放');
  gui.add(eventObj, 'setRotate').name('设置变换器旋转');
  gui.add(eventObj, 'toggleSpace').name('切换空间模式');
  gui.add(eventObj, 'cancelMesh').name('取消选中');
  const snapFolder = gui.addFolder('固定设置');
  snapFolder
    .add(eventObj, 'translateSnapNum', {
      不固定: null,
      1: 1,
      0.1: 0.1,
      10: 10,
    })
    .name('移动基础距离')
    .onChange((value) => {
      tControls.setTranslationSnap(eventObj.translateSnapNum);
    });
  snapFolder
    .add(eventObj, 'rotateSnapNum', 0, 1)
    .step(0.1)
    .name('旋转')
    .onChange(() => {
      tControls.setRotationSnap(eventObj.rotateSnapNum * 2 * Math.PI);
    });
  snapFolder
    .add(eventObj, 'scaleSnapNum', 0, 2)
    .step(0.1)
    .name('缩放')
    .onChange(() => {
      tControls.setScaleSnap(eventObj.scaleSnapNum);
    });
  snapFolder.add(eventObj, 'isClampGroup').name('是否吸附地面');
  snapFolder
    .add(eventObj, 'isLight')
    .name('是否开启灯光')
    .onChange(() => {
      if (eventObj.isLight) {
        renderer.toneMappingExposure = 1;
      } else {
        renderer.toneMappingExposure = 0.1;
      }
    });

  window.addEventListener('keydown', (event) => {
    console.log('event.key', event.key);

    if (tControls.object) {
      if (event.key === 't') {
        eventObj.setTranlate();
      }
      if (event.key === 's') {
        eventObj.setScale();
      }
      if (event.key === 'r') {
        eventObj.setRotate();
      }
      if (event.key === 'Escape') {
        tControls.detach();
      }
    }
  });
  // 添加模型目录
  const folderMesh = gui.addFolder('添加模型');
  const meshAddFolder = gui.addFolder('模型列表');
  const meshList = [
    {
      name: '花瓶',
      path: '/model/house/plants-min.glb',
    },
    {
      name: '单人沙发',
      path: '/model/house/sofa_chair_min.glb',
    },
  ];
  const sceneHouseMeshs = [];
  const meshNumObj = {};
  meshList.forEach((item) => {
    item.addMesh = function () {
      gltfLoader.load(item.path, (gltf) => {
        const houseMesh = {
          ...item,
          object3d: gltf.scene,
        };
        sceneHouseMeshs.push(houseMesh);
        scene.add(houseMesh.object3d);
        tControlsSelect(houseMesh.object3d);
        meshNumObj[houseMesh.name] = meshNumObj[houseMesh.name]
          ? meshNumObj[houseMesh.name] + 1
          : 1;
        const eventObj = {
          selectMesh: function () {
            tControlsSelect(houseMesh.object3d);
          },
        };
        meshAddFolder
          .add(eventObj, 'selectMesh')
          .name(houseMesh.name + meshNumObj[houseMesh.name]);
      });
    };
    folderMesh.add(item, 'addMesh').name(item.name);
  });
  function tControlsSelect(mesh) {
    // 设置变化的3d对象
    tControls.attach(mesh);
  }
}
export default init;

// 不断创建物体的时候
// 清除几何 清除材质 清除纹理 移除物体 dispose scene.remove
