import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { Mesh } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene( )

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')
const matcapTexture = textureLoader.load('textures/matcaps/g.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        // Text
        const textGeometry = new TextGeometry(
            'Sa invatam literele!',
            {
                font: font,
                size: 0.7,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
    }
)


/**
 * Particles
 */

//Geometry
const particlesGeometry = new THREE.BufferGeometry(1,32,32)
const count = 3000
const positions = new Float32Array(count * 3);

for (let i = 0; i< count * 3; i++ ){
    positions[i] = (Math.random() -0.5) * 15
}


particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation : true,
    color: new THREE.Color('#ff88cc'),
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001
    // depthTest: false
    depthWrite: false
})


//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
 const clock = new THREE.Clock()

 const tick = () =>
 {
     const elapsedTime = clock.getElapsedTime()
 
     // Update controls
     controls.update()
     particles.rotation.z += 0.002
    //  particles.rotation.z += 0.001
 
     // Render
     renderer.render(scene, camera)
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick();