import * as THREE from 'three';

// --- SETUP, LUCES, TECLADO (Todo esto se queda igual que antes) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
pointLight.position.set(4, 8, 12);
scene.add(pointLight);

const keyboardLayout = [
    ['react', 'angular', 'vue', 'svelte'],
    ['js', 'ts', 'node', 'python'],
    ['html', 'css', 'sass', 'webpack'],
    ['figma', 'git', 'docker', 'aws']
];
const keySize = 1;
const keySpacing = 0.2;
const textureLoader = new THREE.TextureLoader();
const keyboardGroup = new THREE.Group();
const keys = [];

const keyboardWidth = keyboardLayout[0].length * (keySize + keySpacing) - keySpacing;
const keyboardHeight = keyboardLayout.length * (keySize + keySpacing) - keySpacing;

keyboardLayout.forEach((row, rowIndex) => {
    row.forEach((keyName, colIndex) => {
        const geometry = new THREE.BoxGeometry(keySize, keySize, keySize);
        const texture = textureLoader.load(`icons/${keyName}.svg`); // Usando SVG como pediste
        const material = new THREE.MeshStandardMaterial({ map: texture, color: 0xeeeeee });
        const key = new THREE.Mesh(geometry, material);
        key.position.x = colIndex * (keySize + keySpacing);
        key.position.y = -rowIndex * (keySize + keySpacing);
        key.originalY = key.position.y;
        keyboardGroup.add(key);
        keys.push(key);
    });
});

keyboardGroup.position.x = -keyboardWidth / 2;
keyboardGroup.position.y = keyboardHeight / 2;
scene.add(keyboardGroup);

camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// --- INTERACCIÓN CON RATÓN (Se queda igual) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-100, -100);
let hoveredKey = null;

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

// --- NUEVA ANIMACIÓN CON SCROLL (LA MAGIA DE VERDAD) ---
gsap.registerPlugin(ScrollTrigger);

// Hacemos que la cámara haga un zoom suave hacia el teclado al principio
gsap.to(camera.position, { z: 8, duration: 1.5, ease: "power2.out" });

// La línea de tiempo del scroll
gsap.timeline({
    
    scrollTrigger: {
        trigger: "#contenido",
        start: "top bottom",
        end: "top top",
        scrub: 1,
    }
})

.to("#canvas-container", {
    width: "40px",     
    height: "20px",  
    top: "20%",
    left: "4%",
    ease: "power2.inOut"
})
// En vez de animar el grupo 3D, animamos el CONTENEDOR del canvas
.to(keyboardGroup.rotation, { 
    x: -0.7, // <-- ¡ESTE ES EL VALOR CLAVE! Un número negativo lo "tumba" hacia atrás.
    y: -0.25, // Una ligera rotación lateral para que no sea tan plano.
    z: -0.1  // Una inclinación lateral muy sutil.
}, "<")
// Y al mismo tiempo que el canvas se mueve, hacemos aparecer el gato y el texto
.to("#gato", { opacity: 1, ease: "power2.inOut" }, "<")
.to("#texto-animado", { opacity: 1, ease: "power2.inOut" }, "<");


// --- BUCLE DE RENDER (La parte del hover se queda igual) ---
function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(keys);
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (hoveredKey !== intersectedObject) {
            if (hoveredKey) {
                gsap.to(hoveredKey.position, { y: hoveredKey.originalY, duration: 0.2, ease: "power2.out" });
            }
            hoveredKey = intersectedObject;
            gsap.to(hoveredKey.position, { y: hoveredKey.originalY - 0.2, duration: 0.2, ease: "power2.out" });
        }
    } else {
        if (hoveredKey) {
            gsap.to(hoveredKey.position, { y: hoveredKey.originalY, duration: 0.2, ease: "power2.out" });
            hoveredKey = null;
        }
    }
    renderer.render(scene, camera);
}
animate();

// --- AJUSTE DE VENTANA ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // No redimensionamos el renderer aquí para no interferir con GSAP
    // renderer.setSize(window.innerWidth, window.innerHeight);
});