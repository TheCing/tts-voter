/**
 * Twitch API token refresh script for Vercel deployments
 *
 * Set up as a scheduled task in Vercel to run periodically
 * (recommended every 12 hours to avoid token expiration)
 */

import fetch from "node-fetch";
import { env, argv, exit } from "process";

export async function refreshTwitchToken() {
  try {
    // Get credentials from environment variables
    const clientId = env.TWITCH_CLIENT_ID;

    if (!clientId) {
      throw new Error("Missing Twitch API Client ID in environment variables");
    }

    // For a public app without client secret, we can use client credentials
    // with a special scope that doesn't require authentication
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "client_credentials",
        // For public apps, we don't send a client_secret
      }),
    });

    // If token request fails, try to use existing token
    if (!response.ok) {
      // Check if it's specifically because of missing client secret
      const errorText = await response.text();
      console.error(`Token request failed: ${errorText}`);

      if (errorText.includes("client secret")) {
        console.log("Public app without client secret detected.");

        // For public apps, we can alternately use a static API key approach
        // Update the environment variable to indicate a static approach is needed
        await updateVercelEnvVariable(
          "VITE_TWITCH_API_NOTE",
          "Using static token - visit Twitch dev console to regenerate when needed"
        );

        return {
          success: false,
          error:
            "Public Twitch apps require manual token generation. Please update VITE_TWITCH_ACCESS_TOKEN manually.",
          publicApp: true,
        };
      }

      throw new Error(
        `Failed to refresh token: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    // Update environment variable using Vercel API
    await updateVercelEnvVariable(
      "VITE_TWITCH_ACCESS_TOKEN",
      data.access_token
    );

    console.log("Token refreshed successfully!");
    console.log(`New token expires in ${data.expires_in} seconds`);

    return { success: true };
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return { success: false, error: error.message };
  }
}

async function updateVercelEnvVariable(key, value) {
  // Get required Vercel deployment info from environment
  const vercelToken = env.VERCEL_API_TOKEN;
  const vercelProjectId = env.VERCEL_PROJECT_ID;
  const vercelTeamId = env.VERCEL_TEAM_ID; // Optional, for team projects

  if (!vercelToken || !vercelProjectId) {
    throw new Error("Missing Vercel API credentials");
  }

  let url = `https://api.vercel.com/v9/projects/${vercelProjectId}/env`;
  if (vercelTeamId) {
    url += `?teamId=${vercelTeamId}`;
  }

  // First, check if variable already exists
  const getResponse = await fetch(url, {
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!getResponse.ok) {
    throw new Error(`Failed to get env vars: ${getResponse.status}`);
  }

  const envVars = await getResponse.json();
  const existingVar = envVars.envs.find((env) => env.key === key);

  // Prepare request based on whether we're creating or updating
  const method = existingVar ? "PATCH" : "POST";
  const requestUrl = existingVar
    ? `${url}/${existingVar.id}${vercelTeamId ? `?teamId=${vercelTeamId}` : ""}`
    : url;

  const response = await fetch(requestUrl, {
    method,
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      target: ["production", "preview"],
      type: "plain",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update env var: ${response.status} ${errorText}`
    );
  }

  // Trigger redeployment to apply changes
  await fetch(
    `https://api.vercel.com/v1/integrations/deploy/prj_${vercelProjectId}/lNJG4fNgIH`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    }
  );

  return response.json();
}

// Allow running directly with Node
if (import.meta.url === `file://${argv[1]}`) {
  refreshTwitchToken()
    .then((result) => {
      if (!result.success && !result.publicApp) {
        exit(1);
      }
    })
    .catch((err) => {
      console.error("Unhandled error:", err);
      exit(1);
    });
}

export default refreshTwitchToken;
