import React from 'react';
import { Stack, Tabs } from 'expo-router';

export default function StackLayout() {

    return (
        <Stack
        >
            <Stack.Screen
                name="home"
                options={{
                    headerShown: false
                }}
            />
      

        </Stack>
    );
}
