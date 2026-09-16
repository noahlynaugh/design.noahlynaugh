//This is a component that uses an screenshots made prebuild to preview the
//website in context
import linkPreviews from '../public/link-previews/previews.json'
import staticLinkPreviews from '../public/link-previews/staticPreviews.json'


class WebsitePreview{
    constructor(options = {}) {
    this.previewClass = options.previewClass || 'hover-preview-image';
    this.offset = options.offset || '-2rem'; // px space between link and preview
    this.init();
  }

  init() {
    // Create preview container element once
    this.preview = document.createElement('img');
    this.preview.style.position = 'fixed';
    this.preview.style.marginTop = this.offset;
    this.preview.style.pointerEvents = 'none';
    this.preview.style.transition = 'opacity 0.3s ease';
    this.preview.style.opacity = '0';
    this.preview.style.zIndex = '10000';
    this.preview.className = this.previewClass;
    this.preview.style.maxWidth = '320px';
    this.preview.style.maxHeight = '180px';
    this.preview.style.borderRadius = '4px';
    this.preview.style.background = '#fff';
    this.preview.style.boxShadow = '-.5rem -.5rem 1rem var(--color--boxShadow--light), 1rem 1rem 2rem var(--color--boxShadow--dark)';
    this.preview.style.userSelect = 'none';
    this.linkedInPreview = document.createElement('div')
    this.linkedInPreview.className = "badge-base LI-profile-badge";
    this.linkedInPreview.setAttribute('data-locale', 'en_US');
    this.linkedInPreview.setAttribute('data-size', 'large');
    this.linkedInPreview.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
    this.linkedInPreview.setAttribute('data-type', "HORIZONTAL");
    this.linkedInPreview.setAttribute('data-vanity', "noah-lynaugh");
    this.linkedInPreview.setAttribute('data-version', 'v1')
    this.linkedInPreview.style.opacity = '0';
    this.linkedInPreview.style.position = 'fixed';
    this.linkedInPreview.style.zIndex = '10000';
    this.linkedInPreview.style.marginTop = this.offset;
    this.linkedInPreview.style.pointerEvents = 'none';
    this.linkedInPreview.style.borderRadius = '12px'
  }


attachToLink(link, matchedPreview) {
    if (!link || !matchedPreview) return;

    link.addEventListener('pointerenter', (e) => {
        if(matchedPreview.url === "https://www.linkedin.com/in/noah-lynaugh/"){
          this.positionLinkedInPreview(link)
          this.linkedInPreview.style.opacity = '1';
        } else {
          this.preview.src = matchedPreview.image;
          this.positionPreview(link)
          this.preview.style.opacity = '1';
        }
      });

    
    link.addEventListener('pointermove', (e) => {
      const previewEl = matchedPreview.url === "https://www.linkedin.com/in/noah-lynaugh/"
        ? this.linkedInPreview
        : this.preview;

      const offsetX = matchedPreview.url === "https://www.linkedin.com/in/noah-lynaugh/" ? -155 : -160;
      const offsetY = matchedPreview.url === "https://www.linkedin.com/in/noah-lynaugh/" ? -262 : -180;

      const previewWidth = previewEl.offsetWidth || 320;
      const previewHeight = previewEl.offsetHeight || 180;

      let left = e.clientX + offsetX;
      let top = e.clientY + offsetY;

      // Clamp the position to the viewport
      left = Math.max(0, Math.min(left, window.innerWidth - previewWidth));
      top = Math.max(0, Math.min(top, window.innerHeight - previewHeight));

      previewEl.style.left = `${left}px`;
      previewEl.style.top = `${top}px`;
      previewEl.style.opacity = '1';
  });


    link.addEventListener('pointerout', () => {
      if(matchedPreview.url === "https://www.linkedin.com/in/noah-lynaugh/"){
          this.linkedInPreview.style.opacity = '0';
        } else {
          this.preview.style.opacity = '0';
        }
    });
  }

  positionPreview(link) {
       if (!this.preview.isConnected) {
        link.style.position = 'relative';
        link.appendChild(this.preview);
      };
    }

  positionLinkedInPreview(link) {
    if (!this.linkedInPreview.isConnected) {
    link.style.position = 'relative';
    link.appendChild(this.linkedInPreview);
    window.LIRenderAll(this.linkedInPreview)
  };
}
}

export function initPreviews() {
  const websitePreview = new WebsitePreview();
  const links = document.querySelectorAll('[data-preview]');
  const mergedPreviews = { ...linkPreviews, ...staticLinkPreviews };

  links.forEach(link => {
    const href = link.href;
    const match = Object.values(mergedPreviews).find(item => item.url === href);
    if (match) {
      websitePreview.attachToLink(link, match);
    } else {
      console.warn(`No preview found for ${href}`);
    }
  });
}