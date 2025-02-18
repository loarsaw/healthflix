import CountdownTimer from '@/components/ui/Timer';
import { addToHistory } from '@/redux/historySlice/slice';
import { addAttempted } from '@/redux/questionSlice/slice';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

type Answers = Record<number, string>;

const HomePage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [answers, setAnswers] = useState<Answers>({});
  const { questions } = useSelector((state: RootState) => state.questions);
  const [isOver, setIsOver] = useState(false);
  const dispatch = useDispatch();

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = useCallback(() => {
    if (selectedOption) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: selectedOption,
      }));
      setSelectedOption('');
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      Alert.alert('Please select an option before proceeding.');
    }
  }, [currentQuestionIndex, selectedOption, answers]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setSelectedOption(answers[currentQuestionIndex - 1] || '');
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex, selectedOption, answers]);

  useEffect(() => {
    if (isOver) {
      router.push('/');
    }
  }, [isOver]);

  const handleSubmit = () => {
    let score = 0;
    const attempted = questions.map((data) => data._id);

    questions.forEach((question: any, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
      }
    });

    dispatch(
      addToHistory({
        attemptedOn: new Date().toDateString(),
        id: new Date().toISOString(),
        questions: questions,
        score: score,
      })
    );

    dispatch(addAttempted(attempted));
    router.push('/(history)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 
    We have pushed the state down to Countdown timer 
    */}
      <CountdownTimer isOver={isOver} setIsOver={setIsOver} />

      {/* Current Question */}
      <Text className="text-2xl font-bold text-blue-600 mb-8 text-center px-5 leading-8">
        {currentQuestion.question}
      </Text>

      {/* Options */}
      <View className="w-full mb-10">
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`bg-white border border-gray-300 rounded-xl py-4 mb-4 items-center shadow-sm ${selectedOption === option ? 'bg-green-600 border-green-700' : ''
              }`}
            onPress={() => setSelectedOption(option)}
          >
            <Text className="text-lg text-gray-800">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between w-full px-5">
        <TouchableOpacity
          className={`bg-orange-600 py-3 px-8 rounded-xl justify-center items-center ${currentQuestionIndex === 0 ? 'bg-gray-400' : ''
            }`}
          onPress={handleBack}
          disabled={currentQuestionIndex === 0}
        >
          <Text className="text-white text-lg font-bold">Back</Text>
        </TouchableOpacity>

        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity
            className="bg-orange-600 py-3 px-8 rounded-xl justify-center items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-bold">Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-orange-600 py-3 px-8 rounded-xl justify-center items-center"
            onPress={handleNext}
          >
            <Text className="text-white text-lg font-bold">Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E9F7F1',
  }
})