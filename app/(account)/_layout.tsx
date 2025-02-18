import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function StackLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
            }}>
            {/* Home Screen */}
            <Stack.Screen
                name="index"
                options={{
                    title: 'Account',
                }}
            />
            <Stack.Screen
                name="signin"
                options={{
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    title: 'SignUp',
                }}
            />
            <Stack.Screen
                name="otp"
                options={{
                    title: 'OTP',
                }}
            />
        </Stack>
    );
}
