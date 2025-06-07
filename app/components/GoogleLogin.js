'use client';

import { useEffect, useState } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

export default function GoogleLogin() {
    const [details, setDetails] = useState("");

    useEffect(() => {
        GoogleAuth.initialize({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
            prompt: 'select_account',
        });
    }, []);

    const signIn = async () => {
        try {
            const user = await GoogleAuth.signIn();
            console.log('JWT Token:', user.authentication.idToken);
            setDetails(user.authentication.idToken);
        } catch (err) {
            console.error('Login failed:', err);
            setDetails(err.message || JSON.stringify(err));
        }
    };

    return (
        <div>
            <button onClick={signIn} style={{ fontSize: 18, padding: '10px 20px' }}>
                Sign in with Google
            </button>
            <p>These are details - {details}</p>
        </div>
    );
}
