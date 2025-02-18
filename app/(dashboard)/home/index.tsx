import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SectionList,
  ScrollView,
} from "react-native";
import { Plus } from "lucide-react-native";
import { Timer, TimerContext, TimerContextType } from "@/context/Provider";
import Congrats from "@/components/Congrats";

const TaskModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState<string>("");
  const { timers, addTimer, updateTimer } =
    useContext<TimerContextType>(TimerContext);
  const [duration, setDuration] = useState<string>("");
  const [category, setCategory] = useState<string>("work");

  const workTimers = timers.filter((timer: any) => timer.category === "work");
  const studyTimers = timers.filter((timer: any) => timer.category === "study");
  const sections = [
    { title: "Work", data: workTimers },
    { title: "Study", data: studyTimers },
  ];

  const toggleModal = () => {
    if (name.length > 0 && duration.length > 0) {
      addTimer(name, duration, category);
    }
    setModalVisible(!isModalVisible);
  };

  const startAllTimers = (category: string) => {
    const sectionTimers = timers.filter(
      (timer: any) => timer.category === category
    );
    sectionTimers.forEach((timer: Timer) => {
      updateTimer(timer.id, { status: "Running" });
    });
  };

  const pauseAllTimers = (category: string) => {
    const sectionTimers = timers.filter(
      (timer: any) => timer.category === category
    );
    sectionTimers.forEach((timer: Timer) => {
      updateTimer(timer.id, { status: "Paused" });
    });
  };

  const resetAll = (category: string) => {
    const sectionTimers = timers.filter(
      (timer: any) => timer.category === category
    );
    sectionTimers.forEach((timer: Timer) => {
      updateTimer(timer.id, { status: "Running", remaining: timer.duration });
    });
  };

  return (
    <View className="flex-1 justify-end m-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="flex-1 rounded-lg shadow-md p-4">
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
                  {section.title}
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => startAllTimers(section.title.toLowerCase())}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Start All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => pauseAllTimers(section.title.toLowerCase())}
                    className="bg-yellow-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Pause All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => resetAll(section.title.toLowerCase())}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Reset All</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="p-4 bg-white rounded-lg shadow mb-4">
                <Text className="font-bold text-lg text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  Status: {item.status} | Remaining: {item.remaining}s
                </Text>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => updateTimer(item.id, { status: "Running" })}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Start</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => updateTimer(item.id, { status: "Paused" })}
                    className="bg-yellow-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Pause</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      updateTimer(item.id, {
                        remaining: item.duration,
                        status: "Running",
                      })
                    }
                    className="bg-red-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text className="text-center text-gray-500 mt-4">
                No Timers Found
              </Text>
            )}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-purple-600 rounded-full p-4 shadow-lg"
        onPress={toggleModal}
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      <Congrats />

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
            <Text className="text-lg font-bold mb-4">Add Task</Text>

            <TextInput
              placeholder="Enter Timer Name"
              value={name}
              onChangeText={setName}
              className="border-b mb-4 p-3 text-lg text-gray-800"
            />

            <TextInput
              placeholder="Enter Duration (seconds)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              className="border-b mb-4 p-3 text-lg text-gray-800"
            />

            <View className="border-b mb-4">
              <TouchableOpacity
                onPress={() =>
                  setCategory(category === "work" ? "study" : "work")
                }
                className="p-3"
              >
                <Text className="text-lg text-gray-800">
                  {category === "work" ? "Switch to Study" : "Switch to Work"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={toggleModal}
              className="bg-purple-600 p-4 rounded-lg mt-4 items-center"
            >
              <Text className="text-white text-lg font-bold">Save Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskModal;
