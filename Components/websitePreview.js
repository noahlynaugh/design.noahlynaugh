//This is a component that uses an iframe to preview the
//website in context

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
</style>
    <slot name="websiteIframe">Attach Iframe Here</slot>
`;

export class websitePreview extends HTMLElement {
    constructor() {
        super();
    };
}

customElements.define('website-preview',websitePreview)