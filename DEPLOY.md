# 🚀 Deploying DutchMaster to Vercel

Follow these steps to get your B1 Dutch Tutor live on the web!

## 1. Push your code to GitHub
Make sure you have pushed the latest version of your code to your GitHub repository:
```bash
git add .
git commit -m "Final prep for Vercel deployment"
git push origin master
```

## 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your **GitHub** account.
2. Click the **"Add New..."** button and select **"Project"**.
3. Find your `dutch-tutor` repository in the list and click **"Import"**.

## 3. Configure Environment Variables
Before clicking "Deploy", you **must** add your Gemini API Key so the AI works:
1. In the Vercel setup screen, look for the **"Environment Variables"** section.
2. Add the following:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyCNfdr0k3sA15m7du-2ggb8tffVE_NXVqo` (The key you provided earlier)
3. Click **"Add"**.

## 4. Deploy!
Click the **"Deploy"** button. Vercel will build your app and give you a live URL (e.g., `dutch-master.vercel.app`) in about 1-2 minutes.

## 5. Using on your Phone
Once the URL is live, you can open it on your phone's browser (Safari/Chrome).
- **Pro Tip:** Tap the "Share" button in Safari or the three dots in Chrome and select **"Add to Home Screen"**. It will feel exactly like a real mobile app!

---
*Note: Your progress is currently saved in your browser's Local Storage. If you practice on your computer, your progress won't show on your phone yet. We can add a database later to sync them!*
