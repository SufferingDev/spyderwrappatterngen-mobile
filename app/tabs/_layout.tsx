import { Tabs } from "expo-router";
import React from "react";

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
