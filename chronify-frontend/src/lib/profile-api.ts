// chronify-frontend/src/lib/profile-api.ts

export interface SocialLinkPayload {
  platform:
    | "FACEBOOK"
    | "INSTAGRAM"
    | "TWITTER"
    | "LINKEDIN"
    | "GITHUB"
    | "YOUTUBE"
    | "OTHER";
  url: string;
}

export interface UpdateProfilePayload {
  userName?: string;
  avatarUrl?: string | null;
  coverPhoto?: string | null;
  bio?: string | null;
  dob?: string | null;
  profession?: string | null;
  hobbies?: string[];
  socialLinks?: SocialLinkPayload[];
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  /*
   * Change these keys if your AuthService stores the token
   * under a different localStorage key.
   */
  const tokenKeys = [
    "accessToken",
    "access_token",
    "token",
    "authToken",
  ];

  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  return null;
}

export function hasProfileData(
  payload: UpdateProfilePayload
): boolean {
  return Object.keys(payload).length > 0;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  if (!hasProfileData(payload)) {
    return {
      success: true,
      message: "No profile data to update",
    };
  }

  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await fetch(
    `${API_URL}/users/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to update profile"
    );
  }

  return result;
}