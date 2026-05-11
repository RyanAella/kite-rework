# AGENT.md

## Project Context
This is a lightweight, web-based Visual Novel application. The project prioritizes speed, simplicity, and a clean UI/UX that matches the original Kite App design.

- Do not suggest or install any external libraries or frameworks. So only vanilla JavaScript.
- Use standard Custom Elements (`window.customElements.define`) for modular UI parts.
- The app should work in every browser and on every mobile phone.
- Use Tailwind CSS classes for all styling.
- After adding new Tailwind classes in JS or `app/index.html`, rebuild CSS: `npx @tailwindcss/cli -i ./style.css -o ./app/tailwind.css`. Utilities are scanned from `./app/index.html` and `./app/src/**/*.js` (`@source` in root `style.css`).
- Code Style: Use clean, readable JavaScript with simple English comments. (Using // instead of /*)

## Folder structure

- For the folder strucutre we are using four main files:
    - Top level folder (named ...-scene). All files should be in here.
        - ...-scene: Only one in every scene (in named exactly like the folder its in)
        - ...-service: Represents a non-class service which exports methods that should be seperated from the rest (named after what the service does exp: scroll-service)
        - ...-component: Represents a UI-Component which should be seperatet from the rest (named after what the component is exp: honeycomb-component)
        - ...-handler: Represents a class, which needs its own constructer and has its own methods.