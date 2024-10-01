import * as THREE from 'three'
import * as helper from '../Utils/Functions.js'
import Experience from '../Experience.js'
import Debug from '../Utils/Debug.js'
import State from "../State.js";
import Materials from "../Materials/Materials.js";

export default class SolarSystem {
    experience = Experience.getInstance()
    debug = Debug.getInstance()
    state = State.getInstance()
    materials = Materials.getInstance()
    scene = experience.scene
    time = experience.time
    camera = experience.camera.instance
    renderer = experience.renderer.instance
    resources = experience.resources
    container = new THREE.Group();

    points = experience.world.particles.points

    constructor() {
        this.setModel()
        this.setDebug()
    }

    setModel() {
        this.solarSystemSource = this.resources.items.solarSystemModel
        this.solarSystemModel = this.solarSystemSource.scene.children[0]
        this.solarSystemGeometry = this.solarSystemModel.geometry
        this.solarSystemGeometry.scale(0.5, 0.5, 0.5)

        this.solarSystemTexturePositions = helper.makeTexture(this.solarSystemGeometry)

        // // Set Geometry UVs
        // const gpgpuSize = Math.ceil( Math.sqrt( this.solarSystemGeometry.attributes.position.count ) );
        // const particlesUvArray = new Float32Array(this.solarSystemGeometry.attributes.position.count * 2)
        //
        // for(let i = 0; i < this.solarSystemGeometry.attributes.position.count; i++)
        // {
        //     const i2 = i * 2
        //
        //     // Particles UV
        //     const y = Math.floor(i / gpgpuSize)
        //     const x = i - y * gpgpuSize
        //
        //     particlesUvArray[i2 + 0] = (x + 0.5) / gpgpuSize
        //     particlesUvArray[i2 + 1] = (y + 0.5) / gpgpuSize
        // }
        //
        // this.points.geometry.setAttribute('aSolarSystemUv', new THREE.BufferAttribute(particlesUvArray, 2))
        // this.points.geometry.needsUpdate = true

        this.points.material.uniforms.uSolarSystemTexture.value = this.solarSystemTexturePositions

        //this.scene.add( this.solarSystemModel )
    }

    resize() {

    }

    setDebug() {
        if (!this.debug.active) return

        //this.debug.createDebugTexture( this.resources.items.displacementTexture )
    }

    update(deltaTime) {
        //this.cube2.rotation.y += deltaTime * 20
        //this.cube.rotation.y += deltaTime * 30
    }

}