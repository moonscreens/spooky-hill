import './main.css';
import * as THREE from "three";
import TwitchChat from 'twitch-chat-emotes-threejs';
import Stats from "stats-js";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// a default array of twitch channels to join
let channels = ['moonmoon'];

// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
const query_vars = {};
const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
	query_vars[key] = value;
});

if (query_vars.channels) {
	channels = query_vars.channels.split(',');
}

let stats = false;
if (query_vars.stats) {
	stats = new Stats();
	stats.showPanel(1);
	document.body.appendChild(stats.dom);
}

const ChatInstance = new TwitchChat({
	THREE,

	// If using planes, consider using MeshBasicMaterial instead of SpriteMaterial
	materialType: THREE.SpriteMaterial,

	// Passed to material options
	materialOptions: {
		transparent: true,
	},

	channels,
	maximumEmoteLimit: 3,
})

let camera = new THREE.PerspectiveCamera(39.6, window.innerWidth / window.innerHeight, 0.1, 2000);
//camera is replaced by GLTF loader
camera.layers.enable(1);
//camera.position.z = 20;

if (query_vars.orbit) {
	setInterval(() => {
		camera.position.x = Math.sin(Date.now() / 10000) * 26;
		camera.position.z = Math.cos(Date.now() / 10000) * 26;
		camera.lookAt(0, 0, 0)
	}, 16)
}

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	antialias: false,
	alpha: false,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

function resize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);


let lastFrame = Date.now();
// Called once per frame
function draw() {
	if (stats) stats.begin();
	window.requestAnimationFrame(draw);

	// number of seconds since the last frame was drawn
	const delta = (Date.now() - lastFrame) / 1000;

	if (typeof moon !== 'undefined') moon.rotation.y += delta * 0.02;

	for (let index = emoteArray.length - 1; index >= 0; index--) {
		const element = emoteArray[index];

		// Emotes will travel either towards or away from the camera as a basic example
		element.position.x += element.velocity.x * delta;
		element.position.y += element.velocity.y * delta;
		element.position.z += element.velocity.z * delta;

		// Remove a given set of emotes after 10 seconds have passed
		if (element.dateSpawned < Date.now() - 10000) {
			scene.remove(element);
			emoteArray.splice(index, 1);
		}
	}

	renderer.render(scene, camera);

	lastFrame = Date.now();
	if (stats) stats.end();
}

// add a callback function for when a new message with emotes is sent
const emoteArray = [];
ChatInstance.listen((emotes) => {
	const group = new THREE.Group();

	group.dateSpawned = Date.now();

	group.velocity = new THREE.Vector3(-1, 0, 0).normalize().multiplyScalar(5);
	group.position.copy(spawn.position);
	group.position.z += -10;
	group.position.add(new THREE.Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
	))

	for (let index = 0; index < emotes.length; index++) {
		const emote = emotes[index];

		const sprite = new THREE.Sprite(emote.material);
		sprite.position.x = index;

		group.add(sprite);
	}
	scene.add(group);
	emoteArray.push(group);
})

window.requestAnimationFrame(draw);

function loopAll(object, callback) {
	for (let index = 0; index < object.children.length; index++) {
		const element = object.children[index];
		callback(element);
		if (element.children && element.children.length > 0) {
			loopAll(element, callback);
		}
	}
}

/*
** Scene setup
*/

const modelLoader = new GLTFLoader();
modelLoader.load('/scene.glb', (gltf) => {
	scene.add(gltf.scene);
	camera = gltf.cameras[0];
	camera.far = 250;
	resize();
	loopAll(gltf.scene, (element) => {
		if (element.material) {
			element.material.flatShading = false;
			if (element.name.includes("Hill")) {
				element.receiveShadow = true;
			} else if (element.name !== 'Moon') {
				element.castShadow = true;
				element.receiveShadow = true;
			}
			for (const key in element.material) {
				if (Object.hasOwnProperty.call(element.material, key) && element.material[key]) {
					const prop = element.material[key];
					if (prop.isTexture) {
						prop.magFilter = THREE.NearestFilter
					}
				}
			}
		}

		if (element.name === 'MoonLight') {
			element.castShadow = true;
			element.shadow.mapSize.width = 1024;
			element.shadow.mapSize.height = 1024;
			element.shadow.bias = -0.0004;
		}
	})
});

const spawn = new THREE.Object3D();

scene.fog = new THREE.Fog(0x000E16, 1, 400);

/*
** Sky setup
*/

scene.add(new THREE.AmbientLight(0x021621, 1))


scene.background = new THREE.Color(0x021621);

const cloudGeometry = new THREE.CircleGeometry(250);
import cloudMaterial from './objects/materials/clouds';
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud.position.y = 10;
cloud.rotation.x = Math.PI / 2;
scene.add(cloud);