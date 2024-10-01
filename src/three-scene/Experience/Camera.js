import * as THREE from "three";
import Experience from "./Experience.js";
import Input from "@experience/Utils/Input.js";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import {
    MathUtils
} from "three";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.input = Input.getInstance();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.canvas = this.experience.canvas;
        this.timeline = this.experience.timeline;
        this.cursorEnabled = false;

        this.lerpVector = new THREE.Vector3();
        this.lerpTarget = new THREE.Vector3();

        this.setInstance();
        this.setControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(25, this.sizes.width / this.sizes.height, 0.1, 3000);
        this.defaultCameraPosition = new THREE.Vector3(-0.5, 1.5, 7);

        this.instance.position.copy(this.defaultCameraPosition);
        this.instance.lookAt(new THREE.Vector3(0, 0, 0));

        this.lerpVector.copy(this.instance.position);
        this.lerpTarget.copy(this.instance.position);

        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.minDistance = 0;
        this.controls.maxDistance = 500;
        this.controls.enabled = true;
        this.controls.target = new THREE.Vector3(0, 0, 0);


        // this.controls.mouseButtons = {
        //     LEFT: THREE.MOUSE.ROTATE,
        //     MIDDLE: null,
        //     RIGHT: null,  // Отключает действие для правой кнопки мыши
        // };
        //
        // this.controls.enableZoom = false;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.instance.position.x = MathUtils.damp(this.instance.position.x, (this.input.cursor.x * 0.5) * 5, 3, this.time.delta);
        this.instance.position.y = MathUtils.damp(this.instance.position.y, (this.input.cursor.y * 0.5) * 5, 3, this.time.delta);

        this.controls.update();

        //this.instance.updateMatrixWorld() // To be used in projection

        // let t = 1.0 - Math.pow(0.001, this.time.elapsed);
        //
        // this.instance.position.x = MathUtils.lerp(this.instance.position.x, this.input.cursor.x * 0.5, 0.05 * t)
        // this.instance.position.y = MathUtils.lerp(this.instance.position.y, this.input.cursor.y * 0.5, 0.05 * t)
    }

    animateCameraPosition() {

    }
}