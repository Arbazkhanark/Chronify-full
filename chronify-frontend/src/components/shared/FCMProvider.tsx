'use client';

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export default function FCMProvider() {
  useEffect(() => {
    if (!messaging) return;

    const setupFCM = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
        });

        if (token) {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/save-fcm-token`, {  // ← tumhara backend URL
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}` // ya jo auth token use karte ho
            },
            body: JSON.stringify({ token })
          });
        }

        // Foreground handler (optional)
        onMessage(messaging, (payload) => {
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