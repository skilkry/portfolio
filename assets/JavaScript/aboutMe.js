import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);


gsap.registerPlugin(ScrollTrigger);

// ESCENA
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x00c6ff, 0.5);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// TECLADO DE CUBOS
const textureLoader = new THREE.TextureLoader();
const keyboardGroup = new THREE.Group();
const keys = [];
const keySize = 1.2, keySpacing = 0.3;

const layout = [
  ['React', 'JavaScript', 'Python'],
  ['HTML5', 'CSS3', 'Sass'],
  ['Git']
];

const techData = [
  { name: 'React', id: 'react', description: '...' },
  { name: 'JavaScript', id: 'js', description: '...' },
  { name: 'Python', id: 'python', description: '...' },
  { name: 'HTML5', id: 'html', description: '...' },
  { name: 'CSS3', id: 'css', description: '...' },
  { name: 'Sass', id: 'sass', description: '...' },
  { name: 'Git', id: 'git', description: '...' }
];

layout.forEach((row, rowIndex) => {
  row.forEach((name, colIndex) => {
    const tech = techData.find(t => t.name === name);
    const geo = new THREE.BoxGeometry(keySize, keySize, keySize);
    const mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(`icons/${tech.id}.svg`),
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.2
    });
    const key = new THREE.Mesh(geo, mat);
    key.position.set(
      colIndex * (keySize + keySpacing),
      -rowIndex * (keySize + keySpacing),
      0
    );
    key.userData = tech;
    keyboardGroup.add(key);
    keys.push(key);
  });
});

const width = layout[0].length * (keySize + keySpacing) - keySpacing;
const height = layout.length * (keySize + keySpacing) - keySpacing;
keyboardGroup.position.set(-width / 2 + keySize / 2, height / 2 - keySize / 2, 0);
scene.add(keyboardGroup);

// ANIMACIONES INICIALES
keyboardGroup.position.y += 2;
gsap.to(keyboardGroup.position, {
  y: keyboardGroup.position.y - 2,
  duration: 1.5,
  ease: "power2.out"
});
gsap.from(keyboardGroup.rotation, {
  y: -1,
  duration: 1.5,
  ease: "power2.out"
});
gsap.to(keyboardGroup.rotation, {
  y: "+=0.05",
  duration: 2,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});

// HINT SCROLL
gsap.to("#scroll-hint", {
  opacity: 0,
  y: 20,
  duration: 0.5,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#contenido-scroll",
    start: "top bottom",
    toggleActions: "play none none reverse"
  }
});

// PANEL Y CÁMARA
gsap.timeline({
  scrollTrigger: {
    trigger: "#contenido-scroll",
    start: "top bottom",
    end: "center center",
    scrub: 1
  }
})
.to(camera.position, { z: 10, ease: "power1.in" })
.to(keyboardGroup.rotation, {
  x: -0.9,
  y: -0.4,
  z: -0.2,
  ease: "power1.in"
}, "<")
.to(keyboardGroup.position, {
  x: keyboardGroup.position.x,
  y: keyboardGroup.position.y + 1,
  z: -2,
  ease: "power1.in"
}, "<")
.to("#info-panel", { opacity: 1 }, "-=0.5");

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
