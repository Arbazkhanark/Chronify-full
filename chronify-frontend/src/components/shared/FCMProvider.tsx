'use client';

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export default function FCMProvider() {
  useEffect(() => {
    if (!messaging) return;

    // Capture into a local const so TypeScript keeps the non-null narrowing
    // inside the nested async closure.
    const messagingInstance = messaging;

    const setupFCM = async () => {
      try {
        const token = await getToken(messagingInstance, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
        });

        if (token) {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/save-fcm-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ token })
          });
        }

        // Foreground handler (optional)
        onMessage(messagingInstance, (payload) => {
          console.log("Foreground notification:", payload);
          new Notification(payload.notification?.title || "Reminder", {
            body: payload.notification?.body
          });
        });
      } catch (err) {
        console.error("FCM setup error:", err);
      }
    };

    setupFCM();
  }, []);

  return null;
}