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

# Deployment Fixes

## Issue 1: Stream Title Unavailable - API credentials missing

The application is missing Twitch API credentials in the production environment. To fix this:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`tts-voter`)
3. Click on "Settings" > "Environment Variables"
4. Add the following environment variables:

```
VITE_TWITCH_CLIENT_ID=your_twitch_client_id
VITE_TWITCH_ACCESS_TOKEN=your_twitch_access_token
```

To get these credentials:

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Create a new application or use an existing one
3. Get your Client ID from the developer console
4. Generate a Twitch access token (choose one based on your app type):
   a. Confidential app (with Client Secret):
      - Run this command in your terminal:

        ```bash
        curl -X POST "https://id.twitch.tv/oauth2/token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials"
        ```

      - Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your credentials from the Twitch Developer Console.
      - Copy the `access_token` value from the JSON response.

   b. Public app (no Client Secret):
      - In your Twitch Developer Console, under "Settings", add a Redirect URI (e.g. `https://localhost`).
      - Open this URL in your browser, replacing `YOUR_CLIENT_ID` and `YOUR_REDIRECT_URI`:

        ```
        https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token
        ```

      - Authorize the request. You will be redirected to `YOUR_REDIRECT_URI` with a URL fragment containing `access_token=YOUR_TOKEN`.
      - Copy the `YOUR_TOKEN` value from the URL fragment.

5. Add environment variables in your Vercel project settings:

   ```
   VITE_TWITCH_ACCESS_TOKEN=YOUR_TOKEN
   # If you used the confidential flow, also set:
   TWITCH_CLIENT_SECRET=YOUR_CLIENT_SECRET
   ```

6. Redeploy your application:
    - In the Vercel Dashboard, go to "Deployments" and click "Redeploy" on your latest deployment.

## Issue 2: Permission Denied Error in Firebase

The error `Error checking user vote: Error: Permission denied` indicates that your Firebase security rules are too restrictive for the `userVotes` collection.

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Realtime Database" > "Rules"
4. Update your rules to include permissions for `userVotes`:

```json
{
  "rules": {
    "votes": {
      ".read": true,
      ".write": true
    },
    "messages": {
      ".read": true,
      ".write": true
    },
    "userVotes": {
      ".read": true,
      ".write": true
    }
  }
}
```

For production, you may want to tighten these rules later, but this will fix the immediate issue.

5. Click "Publish" to apply the rule changes

After making these changes, your application should work correctly.
