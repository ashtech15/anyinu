import * as THREE from "three";

export function makeTexture(g) {

    let vertAmount = g.attributes.position.count;
    let texWidth = Math.ceil(Math.sqrt(vertAmount));
    let texHeight = Math.ceil(vertAmount / texWidth);

    let data = new Float32Array(texWidth * texHeight * 4);

    function shuffleArrayByThree(array) {
        const groupLength = 3;

        let numGroups = Math.floor(array.length / groupLength);

        for (let i = numGroups - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            for (let k = 0; k < groupLength; k++) {
                let temp = array[i * groupLength + k];
                array[i * groupLength + k] = array[j * groupLength + k];
                array[j * groupLength + k] = temp;
            }
        }

        return array;
    }


    shuffleArrayByThree(g.attributes.position.array);

    for (let i = 0; i < vertAmount; i++) {
        //let f = Math.floor(Math.random() * (randomTemp.length / 3) );

        const x = g.attributes.position.array[i * 3 + 0] ? ? 2;
        const y = g.attributes.position.array[i * 3 + 1] ? ? 0;
        const z = g.attributes.position.array[i * 3 + 2] ? ? 0;
        const w = 0;

        //randomTemp.splice(f * 3, 3);

        data[i * 4 + 0] = x;
        data[i * 4 + 1] = y;
        data[i * 4 + 2] = z;
        data[i * 4 + 3] = w;
    }

    let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;

    return dataTexture;
}