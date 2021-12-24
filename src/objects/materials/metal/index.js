// Free texture from https://www.poliigon.com/textures/free
import * as THREE from 'three';
import colorMapUrl from './COL.jpg';
import specularMapUrl from './SPECULAR.jpg';
import normalMapUrl from './NRM.jpg';


const mat = new THREE.MeshPhongMaterial({
    map: new THREE.CanvasTexture(document.createElement('canvas')),
    specularMap: new THREE.CanvasTexture(document.createElement('canvas')),
    normalMap: new THREE.CanvasTexture(document.createElement('canvas')),
});

const wrapCount = 20;
const updateTxt = (texture) => {
    texture.wrapS = wrapCount;
    texture.wrapT = wrapCount;
    texture.repeat.set(wrapCount, wrapCount);
    texture.magFilter = THREE.NearestFilter;
}

function resizeTexture (texture, matTexture) {
    const canvas = matTexture.image;
    const ctx = canvas.getContext('2d');
    canvas.width = 96;
    canvas.height = 96;
    ctx.drawImage(texture.image, 0,0,canvas.width, canvas.height);
    matTexture.needsUpdate = true;
}

new THREE.TextureLoader().load(colorMapUrl, texture => {resizeTexture(texture, mat.map)})
new THREE.TextureLoader().load(specularMapUrl, texture => {resizeTexture(texture, mat.specularMap)})
new THREE.TextureLoader().load(normalMapUrl, texture => {resizeTexture(texture, mat.normalMap)})


updateTxt(mat.map);
updateTxt(mat.specularMap);
updateTxt(mat.normalMap);

export default mat;

