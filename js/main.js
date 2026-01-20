import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const container = document.getElementById('container');
const loadingEl = document.getElementById('loading');

if (!container) {
	throw new Error('Missing #container element');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc60104);
scene.fog = new THREE.Fog(0xc60104, 10, 50);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
camera.position.set(5, 3, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
function resizeRendererToDisplaySize() {
	const width = container.clientWidth || window.innerWidth;
	const height = container.clientHeight || window.innerHeight;
	renderer.setSize(width, height, false);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}
resizeRendererToDisplaySize();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3a2a1a, 1.0);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);
const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.4);
sunLight.position.set(10, 15, 8);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 60;
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
sunLight.target.position.set(0, 0, 0);
scene.add(sunLight);
scene.add(sunLight.target);
const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.35);
fillLight.position.set(-12, 10, -10);
fillLight.castShadow = false;
scene.add(fillLight);
{
	const groundGeometry = new THREE.PlaneGeometry(20, 20);
	const groundMaterial = new THREE.MeshLambertMaterial({
		color: 0x2a5298,
		transparent: true,
		opacity: 0.3,
	});
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -2;
	ground.receiveShadow = true;
	scene.add(ground);

	const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
	gridHelper.position.y = -2;
	gridHelper.material.transparent = true;
	gridHelper.material.opacity = 0.3;
	scene.add(gridHelper);
}
let mixer = null;
const clock = new THREE.Clock();
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(new URL('./vendor/three/examples/jsm/libs/draco/', import.meta.url).toString());
loader.setDRACOLoader(dracoLoader);
loader.setMeshoptDecoder(MeshoptDecoder);
const modelPath = './model/fu.glb';
loader.load(
	modelPath,
	(gltf) => {
		const model = gltf.scene;
		scene.add(model);
		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z) || 1;
		const targetSize = 4;
		const scale = targetSize / maxDim;
		model.scale.setScalar(scale);
		box.setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());
		model.position.sub(center);
		model.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		controls.target.set(0, 0, 0);
		controls.update();
		if (gltf.animations && gltf.animations.length > 0) {
			mixer = new THREE.AnimationMixer(model);
			for (const clip of gltf.animations) {
				mixer.clipAction(clip).play();
			}
			console.log('动画已播放:', gltf.animations.length, '个动画');
		} else {
			console.log('模型无动画');
		}

		if (loadingEl) loadingEl.style.display = 'none';
		console.log('模型加载成功:', modelPath);
	},
	(xhr) => {
		if (!loadingEl) return;
		if (xhr.total) {
			const percentComplete = (xhr.loaded / xhr.total) * 100;
			loadingEl.textContent = `加载模型中... ${Math.round(percentComplete)}%`;
		} else {
			loadingEl.textContent = '加载模型中...';
		}
	},
	(error) => {
		console.error('模型加载失败:', error);
		if (!loadingEl) return;

		if (location.protocol === 'file:') {
			loadingEl.textContent = '模型加载失败：你正在用 file:// 打开页面。请用本地服务器运行（例如：python -m http.server 8000）。';
		} else {
			loadingEl.textContent = '模型加载失败，请检查控制台与文件路径。';
		}
	}
);

function animate() {
	requestAnimationFrame(animate);

	controls.update();

	if (mixer) {
		mixer.update(clock.getDelta());
	}

	renderer.render(scene, camera);
}

window.addEventListener('resize', resizeRendererToDisplaySize);
animate();