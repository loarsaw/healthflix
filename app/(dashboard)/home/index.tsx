import { useContext, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Plus, ChevronDown, ChevronUp } from "lucide-react-native";
import { Timer, TimerContext, TimerContextType } from "@/context/Provider";
import Congrats from "@/components/Congrats";

interface TaskForm {
  name: string;
  duration: string;
  category: "work" | "study";
}

const initialFormState: TaskForm = {
  name: "",
  duration: "",
  category: "work",
};

const TaskModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<TaskForm>(initialFormState);
  const [expandedSections, setExpandedSections] = useState({
    work: true,
    study: true,
  });
  const { timers, addTimer, updateTimer } =
    useContext<TimerContextType>(TimerContext);

  const workTimers = useMemo(
    () => timers.filter((timer: Timer) => timer.category === "work"),
    [timers]
  );

  const studyTimers = useMemo(
    () => timers.filter((timer: Timer) => timer.category === "study"),
    [timers]
  );

  const handleSubmit = () => {
    if (form.name.trim() && form.duration.trim()) {
      addTimer(form.name.trim(), form.duration, form.category);
      setModalVisible(false);
      setForm(initialFormState);
    }
  };

  const toggleModal = () => {
    if (!isModalVisible) {
      setForm(initialFormState);
    }
    setModalVisible(!isModalVisible);
  };

  const toggleSection = (section: "work" | "study") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBulkAction = (
    category: string,
    action: "start" | "pause" | "reset"
  ) => {
    const categoryTimers = timers.filter(
      (timer: Timer) => timer.category === category
    );

    categoryTimers.forEach((timer: Timer) => {
      switch (action) {
        case "start":
          updateTimer(timer.id, { status: "Running" });
          break;
        case "pause":
          updateTimer(timer.id, { status: "Paused" });
          break;
        case "reset":
          updateTimer(timer.id, {
            status: "Running",
            remaining: timer.duration,
          });
          break;
      }
    });
  };

  const renderCategoryHeader = (title: string, category: "work" | "study") => (
    <TouchableOpacity
      onPress={() => toggleSection(category)}
      className="flex-row justify-between items-center bg-gray-50 p-2 rounded-t-lg"
    >
      <View className="flex-row items-center">
        {expandedSections[category] ? (
          <ChevronUp className="mr-2" color="#4B5563" size={20} />
        ) : (
          <ChevronDown className="mr-2" color="#4B5563" size={20} />
        )}
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
      </View>

      {expandedSections[category] && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleBulkAction(category, "start")}
            className="bg-green-500 px-3 py-1 rounded-lg"
          >
            <Text className="text-white font-semibold">Start All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBulkAction(category, "pause")}
            className="bg-yellow-500 px-3 py-1 rounded-lg"
          >
            <Text className="text-white font-semibold">Pause All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBulkAction(category, "reset")}
            className="bg-red-500 px-3 py-1 rounded-lg"
          >
            <Text className="text-white font-semibold">Reset All</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  interface ProgressBarProps {
    progress: number;
    status: string;
    duration: number;
    remaining: number;
  }

  const ProgressBar = ({
    progress,
    status,
    duration,
    remaining,
  }: ProgressBarProps) => {
    const getStatusColor = () => {
      switch (status) {
        case "Running":
          return "bg-green-500";
        case "Paused":
          return "bg-yellow-500";
        default:
          return "bg-gray-400";
      }
    };

    return (
      <View className="mb-3">
        {/* Progress bar container */}
        <View className="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
          <View
            className={`h-full rounded-full ${getStatusColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>

        {/* Time information */}
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">{remaining}s remaining</Text>
          <Text className="text-sm text-gray-600">{duration}s total</Text>
        </View>
      </View>
    );
  };

  const renderTimer = ({ item }: { item: Timer }) => {
    const progress = ((item.duration - item.remaining) / item.duration) * 100;

    return (
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-600">Status: {item.status}</Text>
        </View>

        <ProgressBar
          progress={progress}
          status={item.status}
          duration={item.duration}
          remaining={item.remaining}
        />

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => updateTimer(item.id, { status: "Running" })}
            className="bg-green-500 px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-white font-semibold text-center">Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updateTimer(item.id, { status: "Paused" })}
            className="bg-yellow-500 px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-white font-semibold text-center">Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              updateTimer(item.id, {
                remaining: item.duration,
                status: "Running",
              })
            }
            className="bg-red-500 px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-white font-semibold text-center">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const ListEmptyComponent = () => (
    <Text className="text-center text-gray-500 mt-4">No Timers Found</Text>
  );

  return (
    <View className="flex-1 mt-10">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          {renderCategoryHeader("Work", "work")}
          {expandedSections.work && (
            <FlatList
              data={workTimers}
              renderItem={renderTimer}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={ListEmptyComponent}
              className="bg-white rounded-b-lg"
              scrollEnabled={false}
              nestedScrollEnabled
            />
          )}
        </View>

        <View className="mb-20">
          {renderCategoryHeader("Study", "study")}
          {expandedSections.study && (
            <FlatList
              data={studyTimers}
              renderItem={renderTimer}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={ListEmptyComponent}
              className="bg-white rounded-b-lg"
              scrollEnabled={false}
              nestedScrollEnabled
            />
          )}
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
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              className="border-b mb-4 p-3 text-lg text-gray-800"
            />

            <TextInput
              placeholder="Enter Duration (seconds)"
              value={form.duration}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, duration: text }))
              }
              keyboardType="numeric"
              className="border-b mb-4 p-3 text-lg text-gray-800"
            />

            <TouchableOpacity
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  category: prev.category === "work" ? "study" : "work",
                }))
              }
              className="border-b mb-4 p-3"
            >
              <Text className="text-lg text-gray-800">
                Switch to {form.category === "work" ? "Study" : "Work"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
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
