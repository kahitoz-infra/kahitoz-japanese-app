import Cookies from "js-cookie";

const auth_api = process.env.NEXT_PUBLIC_AUTH_URL;

/**
 * Requests a new auth token using the refresh token stored in cookies.
 * - Stores new token in cookies on success.
 * - Redirects to `/` on failure (missing or invalid refresh token).
 * - Returns the new auth token string (or never returns if redirect occurs).
 */
export async function refresh_auth_token() {
  const refreshToken = Cookies.get("refresh_token");

  if (!refreshToken) {
    window.location.href = "/";
    return;
  }

  try {
    const res = await fetch(`${auth_api}/auth_token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) {
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    const newAuthToken = data.auth_token;

    if (!newAuthToken) {
      window.location.href = "/";
      return;
    }

    Cookies.set("auth_token", newAuthToken, {
      expires: 1 / 24,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    return newAuthToken;
  } catch (error) {
    console.error("Error refreshing auth token:", error);
    window.location.href = "/";
  }
}


export async function authFetch(url, options = {}) {
    let token = Cookies.get("auth_token") || (await refresh_auth_token());
    let res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    });
  
    if (res.status === 401) {
      token = await refresh_auth_token();           // will redirect on failure
      res = await fetch(url, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
      });
    }
  
    return res;
  }
  

  