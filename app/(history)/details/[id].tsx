import { RootState } from '@/redux/store';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
};

type SolutionProps = {
    username: string;
    score: number;
    attemptedOn: string;
    questions: Question[];
};

const SolutionDetails: React.FC<SolutionProps> = ({ }) => {
    const params = useLocalSearchParams();
    console.log(params);
    const { questions } = useSelector((state: RootState) => state.questions);

    const { history } = useSelector((state: RootState) => state.history);

    const renderSolution = ({ item, index }: { item: Question; index: number }) => (
        <View className="bg-white p-5 rounded-xl mb-4 shadow-md">
            <Text className="text-lg font-bold text-gray-800 mb-2">
                Q{index + 1}: {item.question}
            </Text>
            <Text className="text-sm text-green-600">
                Correct Answer: {item.correctAnswer}
            </Text>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-gray-100 px-5">
            <View className="items-center mb-5 p-5 bg-blue-600 rounded-xl">
                <Text className="text-lg font-bold text-white mb-2">Score: {history[0].score}</Text>
                <Text className="text-sm text-gray-300">Attempted On: {history[0].attemptedOn}</Text>
            </View>

            <FlatList
                data={questions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSolution}
                className="mt-5"
                scrollEnabled={false}
            />
        </ScrollView>
    );
};

export default SolutionDetails;
