'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Image from "next/image";

const auth_Api = process.env.NEXT_PUBLIC_AUTH_URL;

export default function UnifiedGoogleLoginToken() {
    const router = useRouter();
    const [isNative, setIsNative] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const native = Capacitor.isNativePlatform();
        setIsNative(native);

        if (native) {
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
        setLoading(true);

        try {
            const res = await fetch(`${auth_Api}/google_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            // Set cookies
            const sevenDays = 7 * 24 * 60 * 60;
            document.cookie = `auth_token=${data.auth_token}; path=/; max-age=${sevenDays}; SameSite=Lax`;
            document.cookie = `refresh_token=${data.refresh_token}; path=/; path=/; max-age=${sevenDays}; SameSite=Lax`;

            router.push('/Dashboardv2');
        } catch (err) {
            console.error(err);
            setLoading(false);
            // You can optionally handle errors visually here if you want
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
            // Optionally handle error state here
        }
    };

    const webSignInSuccess = (resp) => {
        if (resp?.credential) {
            handleAuthResponse(resp.credential);
        }
    };

    const webSignInError = () => {
        // Optionally handle error state here
    };

    const renderLoginButton = () =>
        isNative ? (
            <div className='flex justify-center items-center gap-x-2 dark:bg-white dark:text-black p-2 rounded-xl bg-gray-100 text-black'>
                <Image src="/google-logo.webp" width={30} height={30} alt="google" />
                <button onClick={nativeSignIn} className='' disabled={loading}>
                    Sign in with Google
                </button>

            </div>

        ) : (
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <div >
                    <GoogleLogin
                        onSuccess={webSignInSuccess}
                        onError={webSignInError}
                        disabled={loading}
                    />
                </div>
            </GoogleOAuthProvider>
        );

    return (
        <div style={{ textAlign: 'center' }}>
            {renderLoginButton()}
            {loading && (
                <div className={'flex items-center justify-center'}>
                    <Image
                        src="/icons/loading.svg"
                        alt="loading"
                        width={30}
                        height={30}
                        className="animate-spin"
                    />
                </div>
            )}
        </div>
    );
}
