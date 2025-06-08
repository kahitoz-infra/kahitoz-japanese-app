'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const auth_Api = process.env.NEXT_PUBLIC_AUTH_URL;

// export default function UnifiedGoogleLoginToken() {
//     const router = useRouter();
//     const [isNative, setIsNative] = useState(false);
//     const [status, setStatus] = useState('');
//
//     // Initialize Google Auth for native platforms
//     useEffect(() => {
//         const native = Capacitor.isNativePlatform();
//         setIsNative(native);
//         if (native) {
//             GoogleAuth.initialize({
//                 clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Android client ID
//                 scopes: ['profile', 'email'],
//                 forceCodeForRefreshToken: true,
//             }).catch((err) => {
//                 console.error('GoogleAuth initialization failed:', err);
//                 setStatus('Failed to initialize Google Auth');
//             });
//         }
//     }, []);
//
//     // Handle token response and send to backend
//     const handleAuthResponse = async (token) => {
//         setStatus('Sending token to backend...');
//         try {
//             const res = await fetch(`${authApi}/google_login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`, // Ensure backend expects Bearer token
//                 },
//                 body: JSON.stringify({ id_token: token }), // Include token in body if required
//             });
//
//             const data = await res.json();
//             console.log('Backend response:', data);
//
//             if (!res.ok) {
//                 throw new Error(data.detail || 'Login failed');
//             }
//
//             // Store tokens in cookies (or use localStorage if preferred)
//             document.cookie = `auth_token=${data.auth_token}; path=/; secure; SameSite=Lax`;
//             document.cookie = `refresh_token=${data.refresh_token}; path=/; secure; SameSite=Lax`;
//
//             setStatus('Login successful. Redirecting…');
//             router.push('/Dashboard');
//         } catch (err) {
//             console.error('Auth error:', err);
//             setStatus(`Error: ${err.message}`);
//         }
//     };
//
//     // Native (Android) Google Sign-In
//     const nativeSignIn = async () => {
//         try {
//             const user = await GoogleAuth.signIn();
//             if (user?.authentication?.idToken) {
//                 console.log('Native JWT Token:', user.authentication.idToken);
//                 await handleAuthResponse(user.authentication.idToken);
//             } else {
//                 setStatus('No token received from native login');
//             }
//         } catch (err) {
//             console.error('Native login failed:', err);
//             setStatus(`Native login failed: ${err.message}`);
//         }
//     };
//
//     // Web Google Sign-In
//     const webSignInSuccess = (resp) => {
//         if (resp?.credential) {
//             console.log('Web JWT Token:', resp.credential);
//             handleAuthResponse(resp.credential);
//         } else {
//             setStatus('No token received from web login');
//         }
//     };
//
//     const webSignInError = (error) => {
//         console.error('Web login error:', error);
//         setStatus('Web login failed');
//     };
//
//     // Render login button based on platform
//     const renderLoginButton = () =>
//         isNative ? (
//             <button
//                 onClick={nativeSignIn}
//                 style={{ fontSize: 18, padding: '10px 20px', cursor: 'pointer' }}
//             >
//                 Sign in with Google
//             </button>
//         ) : (
//             <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
//                 <div
//                     style={{
//                         display: 'inline-block',
//                         borderRadius: '9999px',
//                         overflow: 'hidden',
//                         fontSize: '20px',
//                         padding: '10px 30px',
//                     }}
//                 >
//                     <GoogleLogin
//                         onSuccess={webSignInSuccess}
//                         onError={webSignInError}
//                         useOneTap
//                         prompt="select_account"
//                     />
//                 </div>
//             </GoogleOAuthProvider>
//         );
//
//     return (
//         <div style={{ textAlign: 'center' }}>
//             {renderLoginButton()}
//             {status && (
//                 <p style={{ marginTop: 20, fontWeight: 'bold' }}>{status}</p>
//             )}
//         </div>
//     );
// }















// 'use client';

//
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Capacitor } from '@capacitor/core';
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// let auth_Api = process.env.NEXT_PUBLIC_AUTH_URL
// export default function UnifiedGoogleLoginToken() {
//     const [details, setDetails] = useState("");
//
//     useEffect(() => {
//         GoogleAuth.initialize({
//             clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//             scopes: ['profile', 'email'],
//             grantOfflineAccess: true,
//             prompt: 'select_account',
//         });
//     }, []);
//
//     const signIn = async () => {
//         try {
//             const user = await GoogleAuth.signIn();
//             console.log('JWT Token:', user.authentication.idToken);
//             setDetails(user.authentication.idToken);
//         } catch (err) {
//             console.error('Login failed:', err);
//             setDetails(err.message || JSON.stringify(err));
//         }
//     };
//
//     return (
//         <div>
//             <button onClick={signIn} style={{ fontSize: 18, padding: '10px 20px' }}>
//                 Sign in with Google
//             </button>
//             <p>These are details - {details}</p>
//         </div>
//     );
// }
export default function UnifiedGoogleLoginToken() {
    const router = useRouter();
    const [isNative, setIsNative] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const native = Capacitor.isNativePlatform();
        setIsNative(native);

        if (native) {
            // ✅ Fix: pass clientId explicitly to avoid error code 10
            GoogleAuth.initialize({
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
                forceCodeForRefreshToken: true,
                prompt: 'select_account',
            });
        }
    }, []);

    const handleAuthResponse = async (token) => {
        setStatus("Sending token to backend...");

        try {
            const res = await fetch(`${auth_Api}/google_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const data = await res.json();
            console.log("This is the data -", data);

            if (!res.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            // Set cookies
            document.cookie = `auth_token=${data.auth_token}; path=/; secure; SameSite=Lax`;
            document.cookie = `refresh_token=${data.refresh_token}; path=/; secure; SameSite=Lax`;

            setStatus("Login successful. Redirecting…");
            router.push('/Dashboard');
        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        }
    };

    const nativeSignIn = async () => {
        try {
            const user = await GoogleAuth.signIn();
            if (user?.authentication?.idToken) {
                handleAuthResponse(user.authentication.idToken);
            }
        } catch (err) {
            console.error('Native login failed:', err);
            setStatus('Native login failed');
        }
    };

    const webSignInSuccess = (resp) => {
        if (resp?.credential) {
            handleAuthResponse(resp.credential);
        }
    };

    const webSignInError = () => {
        setStatus('Web login failed');
    };

    const renderLoginButton = () =>
        isNative ? (
            <button onClick={nativeSignIn} style={{ fontSize: 18, padding: '10px 20px' }}>
                Sign in with Google
            </button>
        ) : (
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <div style={{ display: 'inline-block', borderRadius: '9999px', overflow: 'hidden', fontSize: '20px', padding: '10px 30px' }}>
                    <GoogleLogin
                        onSuccess={webSignInSuccess}
                        onError={webSignInError}
                    />
                </div>
            </GoogleOAuthProvider>
        );

    return (
        <div style={{ textAlign: 'center' }}>
            {renderLoginButton()}
            {status && (
                <p style={{ marginTop: 20, fontWeight: 'bold' }}>{status}</p>
            )}
        </div>
    );
}




