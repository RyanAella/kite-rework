# team-04

## Getting started

*Important:* you have to push your first commit if your branch is new because your environment will first then be created automatically

1. Download Node.js and install Tailwind in your project locally. After installing run *npx @tailwindcss/cli -i ./style.css -o ./app/tailwind.css* in the terminal from the repository root.

   Classes are collected from `./app/index.html` and `./app/src/**/*.js` via Tailwind `@source` (see root `style.css`). Custom wrappers (animations, panorama, buttons, etc.) stay in `@layer utilities` there.

2. Open the team-04 project on Gitlab.

3. Go to Operate/Environments. On your test environment named review/*your branch name you want to test* you have to select on the right side the *Open* button. If you become an 404 Error, you can redeploy the envrironment by clicking on the three buttons icon next to the *Open* button.

