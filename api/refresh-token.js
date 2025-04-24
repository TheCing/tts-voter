/**
 * Vercel Serverless Function to refresh the Twitch API token
 * To be triggered by Vercel Cron Job (see vercel.json)
 * Runs once daily at midnight to ensure token doesn't expire
 */

import refreshTwitchToken from "../scripts/refresh-twitch-token.js";
import { env } from "process";

export default async function handler(req, res) {
  // Only allow scheduled requests or authenticated manual refresh
  const isScheduled = req.headers["x-vercel-cron"] === "true";
  const authHeader = req.headers.authorization;
  const isAuthenticated =
    authHeader && authHeader === `Bearer ${env.REFRESH_SECRET}`;

  if (!isScheduled && !isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await refreshTwitchToken();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Twitch token refreshed successfully",
      });
    } else if (result.publicApp) {
      // For public apps, we need to provide instructions
      return res.status(200).json({
        success: false,
        manualStepsRequired: true,
        message: "Public Twitch apps require manual token generation",
        instructions: [
          "1. Visit https://dev.twitch.tv/console/apps and select your app",
          "2. Go to https://twitchapps.com/tokengen/ and authorize with your client ID",
          "3. Use scopes: 'user:read:email channel:read:stream'",
          "4. Copy the generated token to your VITE_TWITCH_ACCESS_TOKEN environment variable in Vercel",
        ],
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || "Unknown error refreshing token",
      });
    }
  } catch (error) {
    console.error("Error in refresh-token endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
