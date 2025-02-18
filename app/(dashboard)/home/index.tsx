import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Plus } from "lucide-react-native";
import { TimerContext } from "@/context/Provider";

const TaskModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState<string>("");
  const { timers, addTimer } = useContext(TimerContext);
  const [duration, setDuration] = useState<string>("");
  const [category, setCategory] = useState<string | number>("work");

  const toggleModal = () => {
    if ((name.length > 0, duration.length > 0)) {
      addTimer(name, duration, category);
    }
    setModalVisible(!isModalVisible);
  };
  console.log(timers);

  return (
    <View className="flex-1 justify-end m-4">
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
