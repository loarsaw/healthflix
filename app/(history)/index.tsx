import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { TimerContext } from "@/context/Provider";

type TimerItem = {
  id: number;
  completedTime: Date;
  timerName: string;
};

const CompletedTimers: React.FC = () => {
  const { completedList } = useContext(TimerContext);

  const renderItem = ({ item }: { item: TimerItem }) => {
    return (
      <Link href={`/details/${item.id}`}>
        <View className="bg-white rounded-lg shadow-lg mb-4 p-6" style={{ height: 120, width: 320 }}>
          <View className="flex-1">
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Timer Name: {item.timerName}
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              Completed On: {item.completedTime.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 px-5 py-6 justify-center items-center">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
        Completed Timers
      </Text>
      {completedList.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-xl text-gray-500">No Completed Timers</Text>
        </View>
      ) : (
        <FlatList
          data={completedList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default CompletedTimers;
