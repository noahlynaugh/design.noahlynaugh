//Author: Noah Lynaugh
//This file is the the **projectLander** component
//It only needs to run, not be imported by main.js

export class projectLander extends HTMLElement {
    constructor() {
        super();

        //take out shadow root and mimic gal. card
        this.media = this.querySelector("#media");
    }
}

// gallery-card component as a custom HTML element
customElements.define('project-lander', projectLander);