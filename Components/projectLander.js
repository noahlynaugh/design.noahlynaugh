//Author: Noah Lynaugh
//This file is the the **projectLander** component
//It only needs to run, not be imported by main.js

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
</style>
        <div class="landerContainer">
            <slot name="landerMedia" id=landerMedia> Need Media (lander) 
            </slot>
        </div>
`;

class projectLander extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        shadowRoot.appendChild(clone);
        this.media = shadowRoot.querySelector("#landerMedia");
        this.classList.add("projectLander");
    }


    connectedCallback() {
        console.log("project-lander added");
    }

}

// gallery-card component as a custom HTML element
customElements.define('project-lander', projectLander);