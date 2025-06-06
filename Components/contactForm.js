//This is a form to contact me via email.

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
</style>
    <form id="contact-form" class="contact-form" action="https://formsubmit.co/f5af897ae73442ddad633478a311411f" method="POST">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="http://127.0.0.1:5500/Pages/About.html/contact?sent=true">
        <input type="hidden" name="_subject" placeholder="Subject"  value="Someone Has Contacted You Via Design.noahlynaugh.com" required>
        <small>Name (required)</small>
        <div class="form-names">
            <input type="text" class="input-custom" name="First Name" placeholder="First Name" required>
            <input type="text" class="input-custom" name="Last Name" placeholder="Last Name" required>
        </div>
        <small>Email Address (required)</small>
        <div class="form-email">
            <input type="email" class="input-custom input-email" name="Email" placeholder="Your Email Address" required>
        </div>
        <div class="form-group">
            <small>Message (required)</small>
            <textarea placeholder="Your Message" class="textArea-custom" name="Message" rows="10" required></textarea>
        </div>
        <button class="custom scalingHover" type="submit" id="submit-button">
        Send
        <svg width="20.0192" height="16" class="sendArrow">
            <use href="/Assets/SVG/Arrow Graphic.svg#uuid-734dd229-9c06-4076-83cc-49fa06ff17e0"></use>
        </svg>
        </button>
    </form>
`;
export class contactForm extends HTMLElement{
    constructor(){
        super();
        this.append(template.content.cloneNode(true));
    }
}

// nav-bar component as a custom HTML element
customElements.define('contact-form', contactForm);
    