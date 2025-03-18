# Design Portfolio

# Table of Contents 
- [Libraries](#libraries)
- [Usage](#usage)

## Libraries

**Custom HTML Web components** (https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

**Barba JS** (https://barba.js.org/) - used for seamless transitions between pages

**GSAP** (https://gsap.com/) - used to animate tranistions, text on scroll and hover states

**lenis.js**(https://github.com/darkroomengineering/lenis) - for smooth scroll

## Usage

**HTML**

Each HTML page of the project is located in /Pages

**CSS**

All CSS styles are located in styles and are sorted as such
* index for imports to make easy linking to html files
* /base for common sizes and colors
* /components for layout specific css on components

**Web Components**

All web components are created within the components folder

The idea behind web components is to create a common layout for a component that can take dynamic content(using slots) and still retain its function with transitions and other interactions. Being able to create selectors on components helps write less JS code.


**Barba**

The barba transitions are stored in Scripts/barbaApp 

The animations for the transitions are stored Scripts/animations

**Scripts**

Some scripts fill in dynamic data or are functions refactored into their own file in order to clean up code and reduce redundancies.