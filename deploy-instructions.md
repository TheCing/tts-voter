# Vercel Deployment Instructions

## Prerequisites

- A GitHub account
- A Vercel account (sign up at vercel.com)
- A Firebase project with Realtime Database enabled

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code to the repository

   ```bash
   git remote add origin https://github.com/yourusername/tts-voter.git
   git push -u origin main
   ```

## Step 2: Set Up Your Vercel Project

1. Log in to Vercel (vercel.com)
2. Click "New Project" and import your GitHub repository
3. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Step 3: Add Environment Variables in Vercel

1. In your project settings, go to the "Environment Variables" tab
2. Add all your Firebase configuration variables:

   | Name | Value (From Firebase Console) |
   |------|-------------------------------|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API Key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
   | `VITE_FIREBASE_DATABASE_URL` | Your Firebase Database URL |
   | `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
   | `VITE_FIREBASE_APP_ID` | Your Firebase App ID |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Your Firebase Measurement ID |

3. Optionally, add Twitch configuration:
   - `VITE_DEFAULT_CHANNEL`: Your default Twitch channel
   - `VITE_VOTING_THRESHOLD`: Minimum bits required for voting

## Step 4: Deploy

1. Click "Deploy" to build and deploy your application
2. Wait for the build to complete
3. Your application will be available at a URL like `https://tts-voter.vercel.app`

## Step 5: Firebase Database Rules

For production, update your Firebase Realtime Database rules to secure your data:

```json
{
  "rules": {
    "votes": {
      ".read": true,
      ".write": "auth != null || !data.exists()"
    },
    "messages": {
      ".read": true,
      ".write": "auth != null || !data.exists()"
    }
  }
}
```

## Testing Your Deployment

1. Visit your Vercel deployment URL
2. Check the console for any errors
3. Verify that Firebase is connecting correctly

## Troubleshooting

- If Firebase doesn't connect, check your environment variables in Vercel
- If you see CORS errors, check your Firebase project settings and enable your domain
- If you make changes to your code, push to GitHub and Vercel will automatically rebuild
