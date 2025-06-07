This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/Table.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Capacitor Google Sign In

🔐 Capacitor Google Sign-In (Android) Setup
This guide documents how to set up Google Sign-In for a Capacitor + Ionic (Vue) Android app and avoid the dreaded Error Code 10.

✅ Prerequisites
Capacitor installed and configured

Google Cloud Console project created

Your app's appId set correctly (e.g. com.kahitoz.zenkanji)

📦 Plugin Installation
Install the Google Auth plugin:

bash
Copy
Edit
npm install @codetrix-studio/capacitor-google-auth
npx cap sync android
⚙️ Configuration
1. capacitor.config.ts
   ts
   Copy
   Edit
   const config: CapacitorConfig = {
   appId: 'com.kahitoz.zenkanji',
   appName: 'ZenKanji',
   webDir: 'out'
   };

export default config;
2. android/app/build.gradle
   ⚠️ This file is located in android/app/build.gradle — not in the Gradle Scripts root.

Make sure you set your unique applicationId:

groovy
Copy
Edit
android {
defaultConfig {
applicationId "com.kahitoz.zenkanji"
...
}
}
🔑 Get SHA1 Key
Run this command from the android directory:

bash
Copy
Edit
cd android
./gradlew signingReport
Copy the SHA1 key under the debug variant:

r
Copy
Edit
SHA1: 
☁️ Google Cloud Setup
Go to: https://console.cloud.google.com/apis/credentials

A. Create Android OAuth Client
Click "Create Credentials" > OAuth client ID

Choose Android

Set:

Package name: com.kahitoz.zenkanji

SHA1: (your debug SHA1 key)

Save.
👉 You will not use this client ID in code — it's only for Google to validate Android signing.

B. Create Web OAuth Client
Click "Create Credentials" > OAuth client ID

Choose Web

Note the Web Client ID — this is what you will use in your app.

🧠 Important Notes
You MUST create the Android client ID, even if it's not used in code. Without it, Google throws Error 10.

Use the Web Client ID for the plugin.

🧪 Example Usage
ts
Copy
Edit
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

GoogleAuth.signIn().then(user => {
console.log('User Info:', user);
}).catch(err => {
console.error('Login failed:', err);
});
🐛 Debugging
If you get Error 10, double-check:

Application ID in build.gradle

Correct SHA1 (from signingReport)

SHA1 + App ID added to Android OAuth credentials

Web Client ID used in your app code

Wait 5–10 mins after Google Console changes

🥳 It Works!
If it worked, take a break. You earned it.



