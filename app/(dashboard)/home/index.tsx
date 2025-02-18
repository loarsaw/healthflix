import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  SectionList,
} from "react-native";
import { Plus } from "lucide-react-native";
import { TimerContext } from "@/context/Provider";

const TaskModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState<string>("");
  const { timers, addTimer, resetTimer, updateTimer } =
    useContext(TimerContext);
  const [duration, setDuration] = useState<string>("");
  const [category, setCategory] = useState<string | number>("work");

  const workTimers = timers.filter((timer: any) => timer.category === "work");
  const studyTimers = timers.filter((timer: any) => timer.category === "study");
  const sections = [
    { title: "Work", data: workTimers },
    { title: "Study", data: studyTimers },
  ];

  const toggleModal = () => {
    if ((name.length > 0, duration.length > 0)) {
      addTimer(name, duration, category);
    }
    setModalVisible(!isModalVisible);
  };
  console.log(timers);

  return (
    <View className="flex-1 justify-end m-4">
      <View className="flex-1 h-full bg-green-500">
        {/* <FlatList
          data={timers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b">
              <Text className="font-bold">
                {item.name} ({item.category})
              </Text>
              <Text>
                Status: {item.status} | Remaining: {item.remaining}s
              </Text>
            </View>
          )}
        /> */}
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section }) => (
            <Text className="text-xl font-bold text-white mt-4">
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <View className="p-4 bg-white rounded-lg shadow mt-2">
              <Text className="font-bold">{item.name}</Text>
              <Text>
                Status: {item.status} | Remaining: {item.remaining}s
              </Text>

              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => updateTimer(item.id, { status: "Running" })}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  <Text className="text-white">Start</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateTimer(item.id, { status: "Paused" })}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  <Text className="text-white">Pause</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded"
                  onPress={() =>
                    updateTimer(item.id, {
                      remaining: item.duration,
                      status: "Running",
                    })
                  }
                >
                  <Text className="text-white">Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="text-center text-white mt-4">emty</Text>
          )}
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-purple-600 rounded-full p-4 shadow-lg"
        onPress={toggleModal}
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4">Add Task</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border-b mb-4 p-2"
            />
            <TextInput
              placeholder="Duration (seconds)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              className="border-b mb-4 p-2"
            />
            <View className="border-b mb-4">
              <TouchableOpacity
                className="p-2"
                onPress={() =>
                  setCategory(category === "work" ? "study" : "work")
                }
              >
                <Text>{category === "work" ? "Work" : "Study"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-purple-600 p-3 rounded-lg mt-4 items-center"
              onPress={toggleModal}
            >
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskModal;
