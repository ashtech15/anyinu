import * as THREE from "three";
import Experience from "../Experience.js";
import Debug from "../Utils/Debug.js";
import State from "../State.js";
import Materials from "../Materials/Materials.js";

import particlesVertexShader from "../Shaders/Particles/vertex.glsl";
import particlesFragmentShader from "../Shaders/Particles/fragment.glsl";
import Sizes from "@experience/Utils/Sizes.js";
import Input from "@experience/Utils/Input.js";
import * as math from "@experience/Utils/MathHelper.js";
import {
    MathUtils
} from "three";

export default class Particles {
    experience = Experience.getInstance();
    debug = Debug.getInstance();
    state = State.getInstance();
    materials = Materials.getInstance();
    sizes = Sizes.getInstance();
    input = Input.getInstance();
    scene = experience.scene;
    time = experience.time;
    camera = experience.camera.instance;
    renderer = experience.renderer.instance;
    resources = experience.resources;
    container = new THREE.Group();

    particlesCount = 11092;
    normalizeScrollY = 0;
    normalizeScrollYTarget = 0;
    normalizePoints = [0.0, 0.3, 0.6];
    particleSize = 0.226;
    sectionCount = 9;
    range = 1.0 / this.sectionCount;
    //lambda = this.experience.isMobile ? 9 : 3
    lambda = 9

    particlesColors = [
        new THREE.Color(0x260de3),
        new THREE.Color(0x002de0),
        new THREE.Color(0x0062ff)
    ];

    displacement = {};

    constructor() {
        this.setModel();
        //this.createDisplacementTexture()
        this.setListeners();
        this.setAnimation();
        this.setDebug();
    }

    setModel() {
        this.dogCompressedSource = this.resources.items.dogCompressedModel;
        this.dogCompressedModel = this.dogCompressedSource.scene.children[0];

        this.particlesCount = this.dogCompressedModel.geometry.attributes.position.data.count;

        const geometry = new THREE.BufferGeometry();
        geometry.morphAttributes = this.dogCompressedModel.geometry.morphAttributes;
        geometry.morphTargetsRelative = this.dogCompressedModel.geometry.morphTargetsRelative;
        //geometry.setDrawRange(0, 100)
        const positions = new Float32Array(this.particlesCount * 3);
        const colors = new Float32Array(this.particlesCount * 3);
        const a_size = new Float32Array(this.particlesCount);

        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;

            positions[i3] = (Math.random() - 0.5) * 1.5;
            positions[i3 + 1] = (Math.random() - 0.5) * 1.5;
            positions[i3 + 2] = (Math.random() - 0.5) * 1.5;

            const color =
                this.particlesColors[Math.floor(Math.random() * this.particlesColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            a_size[i] = Math.random();
        }

        // InterleavedBufferAttribute convert to BufferAttribute
        //const pos = new THREE.BufferAttribute( this.InterleavedBufferAttributeToBufferAttribute(this.dogCompressedModel.geometry.attributes.position), 3 );

        const ar = new Int16Array(this.particlesCount * 3);

        for (let i = 0; i < this.particlesCount; i++) {
            ar[i * 3] = this.dogCompressedModel.geometry.attributes.position.data.array[i * 4] ? ? 0;
            ar[i * 3 + 1] =
                this.dogCompressedModel.geometry.attributes.position.data.array[i * 4 + 1] ? ? 0;
            ar[i * 3 + 2] =
                this.dogCompressedModel.geometry.attributes.position.data.array[i * 4 + 2] ? ? 0;
            //ar[ i * 4 + 3 ] = this.dogCompressedModel.geometry.attributes.position.data.array[ i * 4 + 3 ];
        }

        const interleavedBuffer = new THREE.InterleavedBuffer(ar, 3);

        //geometry.setAttribute( "position", new THREE.BufferAttribute( dogParticlesModel.geometry.attributes.position.array, 3 ) );
        geometry.setAttribute(
            "position",
            new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0, true)
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("a_size", new THREE.BufferAttribute(a_size, 1));
        geometry.computeVertexNormals();

        const material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms: {
                uTime: {
                    value: 0
                },
                uSize: new THREE.Uniform(this.particleSize),
                uResolution: new THREE.Uniform(
                    new THREE.Vector2(
                        this.sizes.width * this.sizes.pixelRatio,
                        this.sizes.height * this.sizes.pixelRatio
                    )
                ),
                uResolutionDisplacement: new THREE.Uniform(new THREE.Vector2()),
                uCursor: new THREE.Uniform(this.input.cursor3D),
                uCursorDirection: new THREE.Uniform(new THREE.Vector3()),
                uDisplacementTexture: new THREE.Uniform(),
                uParticlesTexture: new THREE.Uniform(),
                uSolarSystemTexture: new THREE.Uniform(),
                uScroll: new THREE.Uniform(0),
                uTotalSections: new THREE.Uniform(this.sectionCount),
                uNormalizePoints: new THREE.Uniform(this.normalizePoints)
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(geometry, material);
        this.points.frustumCulled = false;
        this.points.morphTargetInfluences = this.dogCompressedModel.morphTargetInfluences;
        this.points.morphTargetDictionary = this.dogCompressedModel.morphTargetDictionary;

        this.container.add(this.points);
        this.scene.add(this.container);
    }

    setListeners() {
        window.addEventListener("scroll:update-normalize-y", ({
            detail
        }) => {
            this.normalizeScrollYTarget = detail.currentPoint;
            //this.normalizeScrollY = detail.currentPoint;
        });

        window.addEventListener("scroll:update-breakpoints", ({
            detail
        }) => {
            this.sectionCount = detail.breakpoints.length;
            this.range = 1.0 / this.sectionCount;


            this.normalizePoints = detail.breakpoints;
            this.points.material.uniforms.uNormalizePoints.value = this.normalizePoints;
            this.points.material.uniforms.uTotalSections.value = this.sectionCount;
        });
    }

    resize() {
        this.points.material.uniforms.uResolution.value.set(
            this.sizes.width * this.sizes.pixelRatio,
            this.sizes.height * this.sizes.pixelRatio
        );
    }

    createDisplacementTexture() {
        const displacement = this.displacement;

        const width = this.sizes.width / 8;
        const height = this.sizes.height / 8;

        // 2D canvas
        displacement.canvas = document.createElement("canvas");
        displacement.canvas.width = width;
        displacement.canvas.height = height;
        displacement.canvas.style.position = "fixed";
        displacement.canvas.style.width = `${width}px`;
        displacement.canvas.style.height = `${height}px`;
        displacement.canvas.style.top = 0;
        displacement.canvas.style.left = 0;
        displacement.canvas.style.zIndex = 100;

        if (!this.debug.active) {
            displacement.canvas.style.display = "none";
        } else {
            document.body.appendChild(displacement.canvas);
        }


        // Context
        displacement.context = displacement.canvas.getContext("2d");
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

        // Glow image
        displacement.glowImage = this.resources.items.glowTexture.source.data;

        // Coordinates
        displacement.screenCursor = new THREE.Vector2(9999, 9999);
        displacement.canvasCursor = new THREE.Vector2(9999, 9999);
        displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

        // Texture
        displacement.texture = new THREE.CanvasTexture(displacement.canvas);

        this.points.material.uniforms.uResolutionDisplacement.value.set(width, height);
    }

    setDebug() {
        if (!this.debug.active) return;

        this.debugFolder = this.debug.panel.addFolder("Particles");

        // add particle size
        this.debugFolder
            .add(this, "particleSize")
            .min(0)
            .max(1)
            .step(0.001)
            .name("Particle Size")
            .onChange(() => {
                this.points.material.uniforms.uSize.value = this.particleSize;
            });

        // add particles colors
        this.debugFolder
            .addColor(this.particlesColors, "0")
            .name("Particles Color 1")
            .onChange(() => {
                this.changeColors();
            });
        this.debugFolder
            .addColor(this.particlesColors, "1")
            .name("Particles Color 2")
            .onChange(() => {
                this.changeColors();
            });
        this.debugFolder
            .addColor(this.particlesColors, "2")
            .name("Particles Color 3")
            .onChange(() => {
                this.changeColors();
            });

        // add 0 -> 1
        this.debugFolder
            .add(this, "normalizeScrollY")
            .min(0)
            .max(1)
            .step(0.001)
            .name("Normalize Scroll Y");
    }

    changeColors() {
        const colorAttribute = this.points.geometry.attributes.color;

        for (let i = 0; i < this.particlesCount; i++) {
            const color =
                this.particlesColors[Math.floor(Math.random() * this.particlesColors.length)];
            const i3 = i * 3;
            colorAttribute.array[i3] = color.r;
            colorAttribute.array[i3 + 1] = color.g;
            colorAttribute.array[i3 + 2] = color.b;
        }

        colorAttribute.needsUpdate = true;
    }

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.dogCompressedModel);

        // Actions
        this.animation.actions = {};

        this.animation.actions.idle = this.animation.mixer.clipAction(
            this.dogCompressedSource.animations[0]
        );
        this.animation.actions.open = this.animation.mixer.clipAction(
            this.dogCompressedSource.animations[0]
        );

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        };
    }

    update(deltaTime) {
        if (this.animation) this.animation.mixer.update(this.time.delta);



        this.normalizeScrollY = MathUtils.damp(this.normalizeScrollY, this.normalizeScrollYTarget, this.lambda, deltaTime);

        this.points.material.uniforms.uTime.value = this.time.elapsed;
        this.points.material.uniforms.uCursor.value = this.input.cursor3D;
        this.points.material.uniforms.uCursorDirection.value.set(
            this.input.cursorDirection.x,
            this.input.cursorDirection.y,
            this.input.cursorDirection.z
        );
        this.points.material.uniforms.uScroll.value = this.normalizeScrollY;


        this.updateScrollProgress()

        //this.updateDisplacementCursorTexture();
    }

    updateScrollProgress() {
        let progress = MathUtils.clamp(math.remap(this.normalizeScrollY, 0, this.normalizePoints[1], 0, 1), 0, 1);

        if (this.normalizeScrollY < this.normalizePoints[1]) {
            progress = MathUtils.clamp(math.remap(this.normalizeScrollY, 0, this.normalizePoints[1], 0, 1), 0, 1);
            this.experience.postProcess.bokehPass.uniforms.maxblur.value =
                this.state.bokeh.maxblur + math.mix(0, 0.009, progress);
            this.renderer.toneMappingExposure = math.mix(1, 0.6, progress);
        } else if (this.normalizeScrollY < this.normalizePoints[5]) {
            progress = MathUtils.clamp(math.remap(this.normalizeScrollY, this.normalizePoints[4], this.normalizePoints[5], 0, 1), 0, 1);
            this.experience.postProcess.bokehPass.uniforms.maxblur.value =
                this.state.bokeh.maxblur + math.mix(0.009, 0.0, progress);
        } else if (this.normalizeScrollY < this.normalizePoints[6]) {
            progress = MathUtils.clamp(math.remap(this.normalizeScrollY, this.normalizePoints[5], this.normalizePoints[6], 0, 1), 0, 1);
            this.experience.postProcess.bokehPass.uniforms.maxblur.value =
                this.state.bokeh.maxblur + math.mix(0.0, 0.009, progress);
        }

        return progress;
    }

    updateDisplacementCursorTexture() {
        if (this.experience.isMobile) return;

        /**
         * Displacement
         */
        // Fade out
        const displacement = this.displacement;
        displacement.context.globalCompositeOperation = "source-over";
        displacement.context.globalAlpha = 0.01;
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

        displacement.canvasCursor.x = ((this.input.cursor.x + 1) * displacement.canvas.width) / 2;
        displacement.canvasCursor.y = ((-this.input.cursor.y + 1) * displacement.canvas.height) / 2;

        // Speed alpha
        const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
            displacement.canvasCursor
        );
        displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
        const alpha = Math.min(cursorDistance * 0.05, 1);

        // Draw glow
        const glowSize = displacement.canvas.width * 0.06;
        displacement.context.globalCompositeOperation = "lighten";
        displacement.context.globalAlpha = alpha;
        displacement.context.drawImage(
            displacement.glowImage,
            displacement.canvasCursor.x - glowSize * 0.5,
            displacement.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize
        );

        // Texture
        displacement.texture.needsUpdate = true;
        this.points.material.uniforms.uDisplacementTexture.value = displacement.texture;
    }
}