Noor Cycle - Deploy Guide (Vercel)

1. Install git, create a GitHub repository and push this project.
   - git init
   - git add .
   - git commit -m "Initial Noor Cycle PWA"
   - Create repo on GitHub and push

2. Create a Vercel account (vercel.com) and import the GitHub repo.
   - When prompted, set the build command: `npm run build`
   - Set the output directory: `dist`
   - Set environment variables if needed (none required for this Firebase config in code)

3. After deploy, enable the domain and open the site.
   - Register service worker: the app expects /public/sw.js; Vite copies files from public automatically.

4. For Firebase Cloud Messaging (optional):
   - In Firebase Console > Project Settings > Cloud Messaging, create a VAPID key.
   - Add the VAPID key in your firebaseConfig/messaging initialization and request permission in the app.

Notes:
- You can change firebaseConfig in src/firebaseConfig.js with your own keys.
- For iOS web push: Safari support is limited. Encourage users to Add to Home Screen for best experience.
