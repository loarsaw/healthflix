import React from 'react'
import { Stack } from 'expo-router'

const QuizLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Quiz" }} />
        </Stack>
    )
}

export default QuizLayout