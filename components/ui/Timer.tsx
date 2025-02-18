import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CountdownTimer = ({ isOver, setIsOver }: { isOver: boolean, setIsOver: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval: any = null;

        if (isRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            clearInterval(interval);
            setIsOver(true)
        }

        return () => clearInterval(interval);
    }, [isRunning, secondsLeft]);

    const formatTime = (time: any) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});

export default CountdownTimer;
