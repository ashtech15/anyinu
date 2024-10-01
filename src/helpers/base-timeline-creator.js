import {
    gsap
} from "gsap";

export function addBaseAnimationsToTimeline(tl, elems) {
    tl.addLabel("begin");

    elems.forEach(({
        elem,
        y = -20,
        delay = 0
    }) => {
        gsap.set(elem, {
            y,
            opacity: 0
        });
        tl.to(elem, {
            y: 0,
            opacity: 1,
            delay
        }, "begin");
    });

    return tl;
}