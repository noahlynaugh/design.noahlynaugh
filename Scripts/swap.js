function swap([from,to]){
    let fromID = from.getAttribute("data-flip-id"),
        toID = to.getAttribute("data-flip-id");
    from.setAttribute("data-flip-id", toID);
    to.setAttribute("data-flip-id", fromID); 
}


export default swap;

export {default as swap} from "./swap.js";
