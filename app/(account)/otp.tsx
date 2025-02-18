import { RootState } from '@/redux/store';
import { setItem } from '@/utils/asyncStorage';
import axiosInstance from '@/utils/axiosInstance';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { user: { email } } = useSelector((state: RootState) => state.user);

  const handleInputChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      const { data } = await axiosInstance.post("/verify-otp", { email: email, token: otp.join("") });
      console.log(data);
      await setItem("accessToken", data.token);
      await setItem("refreshToken", data.refreshToken);
      router.push("/");
    } else {
      Alert.alert('Error', 'Please enter a 6-digit OTP');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', 'A new OTP has been sent to your phone.');
  };

  return (
    <View className="flex-1 p-5 bg-white justify-center">
      <Text className="text-2xl font-bold text-center mb-2">Enter OTP</Text>
      <Text className="text-base text-center text-gray-600 mb-6">
        We've sent a 6-digit code to your email.
      </Text>

      <View className="flex-row justify-between mb-8">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            className={`w-10 h-12 border border-gray-300 rounded-md text-center text-lg ${digit ? 'border-blue-500' : 'border-gray-300'}`}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(ref) => (inputs.current[index] = ref)} // Assign ref correctly
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity className="bg-blue-600 p-4 rounded-md items-center mb-4" onPress={handleVerify}>
        <Text className="text-white text-lg font-bold">Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend}>
        <Text className="text-blue-600 text-center text-base">Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPPage;
