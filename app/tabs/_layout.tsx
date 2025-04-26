// File: app/tabs/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="shell"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="wrap"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="burnish"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}