/**
 * ZoomViewer - A full-screen media viewer with zoom and pan capabilities
 * Supports both images and videos with Photoshop/Figma-style interactions
 */
class ZoomViewer {
  constructor(options = {}) {
    this.zoomClass = options.zoomClass || 'image-zoom-viewer';
    this.maxZoom = options.maxZoom || 3;
    this.minZoom = options.minZoom || 0.5;
    this.zoomStep = options.zoomStep || 0.2;
    this.init();
  }

  /**
   * Initialize the zoom viewer component
   * Creates all DOM elements and sets up the viewer structure
   */
  init() {
    // Create zoom container
    this.zoomContainer = document.createElement('div');
    this.zoomContainer.className = this.zoomClass;
    this.zoomContainer.style.position = 'fixed';
    this.zoomContainer.style.top = '0';
    this.zoomContainer.style.left = '0';
    this.zoomContainer.style.width = '100vw';
    this.zoomContainer.style.height = '100vh';
    this.zoomContainer.style.backgroundColor = 'var(--color--boxShadow--dark)';
    this.zoomContainer.style.backdropFilter = 'blur(8px) brightness(0.3)';
    this.zoomContainer.style.zIndex = '10001';
    this.zoomContainer.style.opacity = '0';
    this.zoomContainer.style.visibility = 'hidden';
    this.zoomContainer.style.transition = 'opacity 0.3s ease';
    this.zoomContainer.style.display = 'flex';
    this.zoomContainer.style.alignItems = 'center';
    this.zoomContainer.style.justifyContent = 'center';

    // Create image container - handles all zoom/pan interactions
    this.imageContainer = document.createElement('div');
    this.imageContainer.style.aspectRatio = '16/9';
    this.imageContainer.style.position = 'relative';
    this.imageContainer.style.overflow = 'hidden';
    this.imageContainer.style.cursor = 'grab';
    this.imageContainer.style.maxWidth = '100vw';
    this.imageContainer.style.maxHeight = '100vh';
    this.imageContainer.style.width = '100vw';
    this.imageContainer.style.height = '100vh';

    // Create zoomed media (image or video) - dynamically switches between types
    this.zoomedMedia = document.createElement('img');
    this.zoomedMedia.style.borderRadius = '4px';
    this.zoomedMedia.style.position = 'absolute';
    this.zoomedMedia.style.top = '50%';
    this.zoomedMedia.style.left = '50%';
    this.zoomedMedia.style.transform = 'translate(-50%, -50%)';
    this.zoomedMedia.style.maxWidth = 'none';
    this.zoomedMedia.style.maxHeight = 'none';
    this.zoomedMedia.style.userSelect = 'none';
    this.zoomedMedia.style.pointerEvents = 'none'; // Allows pointer events to pass through to container

    // Create close button with arrow icon
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = `
      <svg style="transform: rotate(180deg); width: 16px; height: 16px; flex-shrink: 0;" viewBox="0 0 20.02 16">
        <defs>
          <style>
            .uuid-1a9111b1-de57-4b97-85b2-9ec15684d16b {
              fill: currentColor;
            }
          </style>
        </defs>
        <g data-name="Layer_1">
          <polygon class="uuid-1a9111b1-de57-4b97-85b2-9ec15684d16b" points="20.02 8 11.42 16 8.69 13.27 12.29 9.92 0 9.92 0 6.07 12.28 6.07 8.69 2.73 11.42 0 20.02 8"/>
        </g>
      </svg>
      Back
    `;
    this.closeButton.style.position = 'absolute';
    this.closeButton.style.top = '2rem'; //margin for
    this.closeButton.style.left = '2rem';
    this.closeButton.style.background = 'var(--color--elevation)';
    this.closeButton.style.border = 'none';
    this.closeButton.style.borderRadius = '4px';
    this.closeButton.style.width = 'fit-content';
    this.closeButton.style.height = 'fit-content';
    this.closeButton.style.color = 'var(--color--text)';
    this.closeButton.style.fontSize = 'var(--font-size-1)';
    this.closeButton.style.fontWeight = '300';
    this.closeButton.style.cursor = 'pointer';
    this.closeButton.style.zIndex = '10002';
    this.closeButton.style.transition = 'background-color 0.2s ease';
    this.closeButton.style.backdropFilter = 'blur(4px)';
    this.closeButton.style.display = 'flex';
    this.closeButton.style.alignItems = 'center';
    this.closeButton.style.justifyContent = 'center';
    this.closeButton.style.gap = '0.5rem';
    this.closeButton.style.padding = '0.5rem 1rem';
    this.closeButton.classList.add('scalingHover');

    this.closeButton.addEventListener('pointerenter', () => {
      this.closeButton.style.color = 'var(--color--hoverText)';
    });

    this.closeButton.addEventListener('pointerleave', () => {
      this.closeButton.style.backgroundColor = 'var(--color--elevation)';
      this.closeButton.style.color = 'var(--color--text)';
    });

    // Create zoom controls - base controls for all media types
    this.zoomControls = document.createElement('div');
    this.zoomControls.style.position = 'absolute';
    this.zoomControls.style.bottom = '20px';
    this.zoomControls.style.right = '20px';
    this.zoomControls.style.display = 'flex';
    this.zoomControls.style.gap = '10px';
    this.zoomControls.style.zIndex = '10002';

    this.zoomInBtn = this.createZoomButton('+', () => this.zoomIn());
    this.zoomOutBtn = this.createZoomButton('−', () => this.zoomOut());

    this.zoomControls.appendChild(this.zoomOutBtn);
    this.zoomControls.appendChild(this.zoomInBtn);

    // Assemble the component
    this.imageContainer.appendChild(this.zoomedMedia);
    this.zoomContainer.appendChild(this.closeButton);
    this.zoomContainer.appendChild(this.zoomControls);
    this.zoomContainer.appendChild(this.imageContainer);

    // Add to document
    document.body.appendChild(this.zoomContainer);

    // Initialize state variables
    this.currentZoom = 1;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.initialMediaWidth = 0;
    this.initialMediaHeight = 0;
    this.isVideo = false; // Tracks current media type

    this.setupEventListeners();
  }

  /**
   * Create a zoom control button with consistent styling
   */
  createZoomButton(text, onClick) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.style.background = 'var(--color--elevation)';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.color = 'var(--color--text)';
    button.style.fontSize = '18px';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.2s ease';
    button.style.backdropFilter = 'blur(4px)';
    button.classList.add('scalingHover');

    button.addEventListener('pointerenter', () => {
      button.style.color = 'var(--color--hoverText)';
    });

    button.addEventListener('pointerleave', () => {
      button.style.color = 'var(--color--text)';
    });

    button.addEventListener('click', onClick);
    return button;
  }

  /**
   * Set up all event listeners for interactions
   * Handles keyboard, mouse, and touch events
   */
  setupEventListeners() {
    // Close on background click or escape key
    this.zoomContainer.addEventListener('click', (e) => {
      if (e.target === this.zoomContainer) {
        this.close();
      }
    });

    this.closeButton.addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.zoomContainer.style.visibility === 'visible') {
        this.close();
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      if (this.zoomContainer.style.visibility === 'visible') {
        this.close();
      }
    });

    // Handle mouse back/forward buttons
    document.addEventListener('pointerdown', (e) => {
      if (e.button === 3 || e.button === 4) { // Back = 3, Forward = 4
        if (this.zoomContainer.style.visibility === 'visible') {
          this.close();
        }
      }
    });

    // ===== ZOOM AND PAN INTERACTIONS =====
    // These work for both images and videos

    // Pointer events for dragging (click and drag to pan)
    this.imageContainer.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.imageContainer.style.cursor = 'grabbing';
      this.imageContainer.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    this.imageContainer.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;
        
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        
        this.constrainPan();
        this.updateImageTransform();
        
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
    });

    this.imageContainer.addEventListener('pointerup', (e) => {
      this.isDragging = false;
      this.imageContainer.style.cursor = 'grab';
      this.imageContainer.releasePointerCapture(e.pointerId);
    });

    // Wheel events for zoom and pan (Photoshop/Figma-style interactions)
    this.imageContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      if (e.altKey) {
        // Alt + scroll = zoom in/out (faster zoom)
        const delta = e.deltaY > 0 ? -this.zoomStep * 1.5 : this.zoomStep * 1.5;
        this.zoomAtPoint(e.clientX, e.clientY, delta);
      } else if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + scroll = pan horizontally
        this.offsetX -= e.deltaY * 0.5;
        this.constrainPan();
        this.updateImageTransform();
      } else {
        // Just wheel = zoom in/out (normal speed)
        const delta = e.deltaY > 0 ? -this.zoomStep : this.zoomStep;
        this.zoomAtPoint(e.clientX, e.clientY, delta);
      }
    });
  }

  /**
   * Zoom towards a specific point (mouse cursor position)
   * Creates natural zoom behavior like in design tools
   */
  zoomAtPoint(clientX, clientY, delta) {
    const rect = this.imageContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate zoom point relative to image center
    const zoomPointX = clientX - centerX;
    const zoomPointY = clientY - centerY;
    
    const oldZoom = this.currentZoom;
    this.setZoom(this.currentZoom + delta);
    const newZoom = this.currentZoom;
    
    // Adjust offset to zoom towards the mouse position
    const zoomRatio = newZoom / oldZoom;
    this.offsetX = zoomPointX - (zoomPointX - this.offsetX) * zoomRatio;
    this.offsetY = zoomPointY - (zoomPointY - this.offsetY) * zoomRatio;
    
    this.updateImageTransform();
  }

  /**
   * Update the transform of the media element
   * Applies zoom scale and pan offset
   */
  updateImageTransform() {
    this.zoomedMedia.style.transform = `translate(-50%, -50%) translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.currentZoom})`;
  }

  /**
   * Constrain panning to keep media within bounds
   * Prevents empty space from showing around the edges
   */
  constrainPan() {
    const containerRect = this.imageContainer.getBoundingClientRect();
    
    // Get the correct dimensions based on media type
    let mediaWidth, mediaHeight;
    if (this.isVideo) {
      mediaWidth = this.zoomedMedia.videoWidth;
      mediaHeight = this.zoomedMedia.videoHeight;
    } else {
      mediaWidth = this.zoomedMedia.naturalWidth;
      mediaHeight = this.zoomedMedia.naturalHeight;
    }
    
    // Calculate the scaled media dimensions
    const scaledWidth = mediaWidth * this.currentZoom;
    const scaledHeight = mediaHeight * this.currentZoom;
    
    // Calculate boundaries
    const maxOffsetX = Math.max(0, (scaledWidth - containerRect.width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - containerRect.height) / 2);
    
    // Constrain the offset
    this.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, this.offsetX));
    this.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, this.offsetY));
  }

  /**
   * Set zoom level with bounds checking
   */
  setZoom(zoom) {
    this.currentZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.constrainPan();
  }

  /**
   * Zoom in by one step
   */
  zoomIn() {
    this.setZoom(this.currentZoom + this.zoomStep);
    this.updateImageTransform();
  }

  /**
   * Zoom out by one step
   */
  zoomOut() {
    this.setZoom(this.currentZoom - this.zoomStep);
    this.updateImageTransform();
  }

  /**
   * Open media in the zoom viewer
   * Handles both images and videos with appropriate setup
   */
  open(mediaSrc, initialState = {}) {
    // Determine if it's a video based on file extension
    const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(mediaSrc);
    
    if (isVideo) {
      // ===== VIDEO HANDLING =====
      // Create video element with specific video properties
      const video = document.createElement('video');
      video.src = mediaSrc;
      video.controls = false; // Don't use native controls
      video.autoplay = true; // Enable autoplay
      video.muted = true;
      video.loop = true; // Add loop
      video.style.borderRadius = '4px';
      video.style.position = 'absolute';
      video.style.top = '50%';
      video.style.left = '50%';
      video.style.transform = 'translate(-50%, -50%)';
      video.style.maxWidth = 'none';
      video.style.maxHeight = 'none';
      video.style.userSelect = 'none';
      video.style.pointerEvents = 'none'; // Allow pointer events to pass through
      
      // Replace the current media element
      this.imageContainer.removeChild(this.zoomedMedia);
      this.zoomedMedia = video;
      this.imageContainer.appendChild(this.zoomedMedia);
      this.isVideo = true;
      
      // Wait for video metadata to load before setting up zoom/pan
      video.addEventListener('loadedmetadata', () => {
        this.currentZoom = 0.5;
        this.offsetX = 0;
        this.offsetY = 0;
        this.initialMediaWidth = video.videoWidth;
        this.initialMediaHeight = video.videoHeight;
        this.constrainPan();
        this.updateImageTransform();
        
        // Restore video state if provided (preserves playback position)
        if (initialState.currentTime !== undefined) {
          video.currentTime = initialState.currentTime;
        }
        if (initialState.muted !== undefined) {
          video.muted = initialState.muted;
        }
        if (initialState.volume !== undefined) {
          video.volume = initialState.volume;
        }
        
        // Add video-specific controls to zoom controls
        this.addVideoControls(video, initialState.paused);
        
        // Start playing if it wasn't paused
        if (!initialState.paused) {
          video.play().catch(err => {
            console.warn('Autoplay failed:', err);
          });
        }
      });
    } else {
      // ===== IMAGE HANDLING =====
      // Handle as image - switch from video if needed
      if (this.isVideo) {
        // Replace video with image element
        const img = document.createElement('img');
        img.style.borderRadius = '4px';
        img.style.position = 'absolute';
        img.style.top = '50%';
        img.style.left = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'none'; // Allow pointer events to pass through
        
        this.imageContainer.removeChild(this.zoomedMedia);
        this.zoomedMedia = img;
        this.imageContainer.appendChild(this.zoomedMedia);
        this.isVideo = false;
        
        // Remove video controls if they exist
        this.removeVideoControls();
      }
      
      this.zoomedMedia.src = mediaSrc;
      
      // Wait for image to load before setting initial state
      this.zoomedMedia.onload = () => {
        this.currentZoom = 0.5;
        this.offsetX = 0;
        this.offsetY = 0;
        this.initialMediaWidth = this.zoomedMedia.naturalWidth;
        this.initialMediaHeight = this.zoomedMedia.naturalHeight;
        this.constrainPan();
        this.updateImageTransform();
      };
    }
    
    // Show the zoom viewer
    this.zoomContainer.style.visibility = 'visible';
    this.zoomContainer.style.opacity = '1';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Add video-specific controls (play/pause, mute/unmute)
   * These appear alongside the zoom controls
   */
  addVideoControls(video, isPaused) {
    // Remove existing video controls if any
    this.removeVideoControls();
    
    // Create play/pause button
    this.playPauseBtn = this.createZoomButton('⏸', () => {
      if (video.paused) {
        video.play();
        this.playPauseBtn.innerHTML = '⏸';
      } else {
        video.pause();
        this.playPauseBtn.innerHTML = '▶';
      }
    });
    
    // Create mute/unmute button
    this.muteBtn = this.createZoomButton('🔊', () => {
      if (video.muted) {
        video.muted = false;
        this.muteBtn.innerHTML = '🔊';
      } else {
        video.muted = true;
        this.muteBtn.innerHTML = '🔇';
      }
    });
    
    // Add video controls to zoom controls
    this.zoomControls.appendChild(this.playPauseBtn);
    this.zoomControls.appendChild(this.muteBtn);
    
    // Restore video state if provided
    if (isPaused) {
      video.pause();
      this.playPauseBtn.innerHTML = '▶';
    }
  }

  /**
   * Remove video controls when switching to image
   */
  removeVideoControls() {
    if (this.playPauseBtn) {
      this.zoomControls.removeChild(this.playPauseBtn);
      this.playPauseBtn = null;
    }
    if (this.muteBtn) {
      this.zoomControls.removeChild(this.muteBtn);
      this.muteBtn = null;
    }
  }

  /**
   * Close the zoom viewer with fade animation
   */
  close() {
    this.zoomContainer.style.opacity = '0';
    setTimeout(() => {
      this.zoomContainer.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }, 300);
  }
}

/**
 * Initialize zoom functionality for all elements with data-zoom attribute
 * Handles both images and videos, preserving video state
 */
export function initImageZoom() {
  const imageZoomViewer = new ZoomViewer();
  const mediaElements = document.querySelectorAll('[data-zoom]');

  mediaElements.forEach(element => {
    element.style.cursor = 'zoom-in';
    element.addEventListener('click', () => {
      const mediaSrc = element.src || element.getAttribute('data-zoom-src');
      if (mediaSrc) {
        // If it's a video element, preserve its current state
        if (element.tagName === 'VIDEO') {
          imageZoomViewer.open(mediaSrc, {
            currentTime: element.currentTime,
            paused: element.paused,
            muted: element.muted,
            volume: element.volume
          });
        } else {
          imageZoomViewer.open(mediaSrc);
        }
      }
    });
  });
} 