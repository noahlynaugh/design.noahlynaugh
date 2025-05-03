const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
</style>
    <footer class="footerContainer">
        <div class="footerSocials">
            <slot name="footerNavTitle" class="logoLinkblock">
                <slot name="websiteNamelink" class="websiteNameLink"> Website Name </slot>
            </slot>
            <div class="socialIcons">
                <slot name= "svgIcon" class="svgIcon scalingHover"> </slot>
            </div>
        </div>
        <div class="lineSpacer"></div>
        <slot name="footerBottom" class="footerBottom">bottom</slot>
    </footer> 
`;

class Footer extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        shadowRoot.append(clone);
        this.className = "footer"
    }
}

// nav-bar component as a custom HTML element
customElements.define('bottom-footer', Footer);