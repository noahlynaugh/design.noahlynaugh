function swap([from,to]){
    let fromSlot = from.querySelector("#media").getAttribute("slot"),
    toSlot = to.querySelector("#media").getAttribute("slot"),
    fromID = from.getAttribute("data-flip-id") || "from" + gsap.utils.random(0, 9999, 1),
    toID = to.getAttribute("data-flip-id") || "to" + gsap.utils.random(0, 9999, 1),
    fromClass = from.querySelector("#media").className,
    toClass = to.querySelector("#media").className;
    to.appendChild(from.media.assignedNodes()[0]);
    from.appendChild(to.media.assignedNodes()[0]);
    to.querySelector("#media").setAttribute("slot", toSlot);
    from.querySelector("#media").setAttribute("slot", fromSlot);
    to.setAttribute("data-flip-id", fromID);
    from.setAttribute("data-flip-id", toID);  
    from.querySelector("#media").className = fromClass;
    to.querySelector("#media").className = toClass;
}

export default swap;

export {default as swap} from "./swap.js";
