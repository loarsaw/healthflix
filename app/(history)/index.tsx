import { RootState } from "@/redux/store";
import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { backgroundVariantByScore } from "../../utils/cva";
import { TimerContext } from "@/context/Provider";

type TimerItem = {
  id: number;
  completedTime: Date;
  timerName: string;
};

const CompletedTimers: React.FC = () => {
  const {completedList} = useContext(TimerContext)
  const renderItem = ({ item }: { item: TimerItem }) => {
    return (
      <Link href={`/details/${item.id}`}>
        <View className={backgroundVariantByScore(4)}>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">
              Timer Name: {item.timerName}
            </Text>
            <Text className="text-sm text-gray-600">
              Completed On: {item.completedTime.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 px-5">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-5">
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
