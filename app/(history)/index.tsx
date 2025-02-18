import { RootState } from '@/redux/store';
import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { backgroundVariantByScore } from '../../utils/cva';
import clsx from 'clsx';

type quesString = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type HistoryItem = {
  id: string;
  questions: quesString[];
  score: number;
  attemptedOn: string;
};

const QuizHistory: React.FC = () => {
  const { history } = useSelector((state: RootState) => state.history);

  const renderItem = ({ item }: { item: HistoryItem }) => {
    console.log(item.score)
    return (
      <Link href={`/details/${item.id}`}>
        <View className={backgroundVariantByScore(4)}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            className="w-12 h-12 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">
              Attempted On: {item.attemptedOn}
            </Text>
            <View className={clsx(item.score > 0 ? "bg-green-300" : "bg-white", "w-full p-4")}>

              <Text className="text-sm text-gray-600">Score: {item.score}</Text>
            </View>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 px-5">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-5">Quiz History</Text>
      {history.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-xl text-gray-500">No Attempted Quiz</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default QuizHistory;
