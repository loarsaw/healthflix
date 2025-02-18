import { TimerContext } from "@/context/Provider";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

const Congrats: React.FC = () => {
  const {
    setCongModal,
    congModal,
    setCompletedList,
    completedTimer,
    completedTimerName,
    setCompletedTimerName,
  } = useContext(TimerContext);
  // const {} =
  return (
    <Modal visible={congModal} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-4/5">
          <Text className="text-lg font-bold mb-4 text-center">
            Congratulations, {completedTimerName}
          </Text>
          <Text className="text-center mb-4">
            You've completed your task successfully! Keep up the great work.
          </Text>
          <TouchableOpacity
            className="bg-purple-600 p-3 rounded-lg mt-4 items-center"
            onPress={() => {
              setCompletedList((per: []) => [
                ...per,
                {
                  id: completedTimer,
                  completedTime: new Date(),
                  timerName: completedTimerName,
                },
              ]);
              setCongModal(false);
              setCompletedTimerName(null);
            }}
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Congrats;
