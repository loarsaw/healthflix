import { Text, View } from "react-native";

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
      <View className="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <View
          className={`h-full rounded-full ${getStatusColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm text-gray-600">{remaining}s remaining</Text>
        <Text className="text-sm text-gray-600">{duration}s total</Text>
      </View>
    </View>
  );
};

export default ProgressBar;
