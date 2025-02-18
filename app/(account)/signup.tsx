import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Link, router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux/userSlice/slice';
import { RootState } from '@/redux/store';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const { loading } = useSelector((state: RootState) => state.async)
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      await axiosInstance.post('/sign-up', { email: data.email, password: data.password });
      const user = { email: data.email };
      dispatch(addUser(user));
      router.push('/otp');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 relative bg-white">
      <View className="absolute top-0 w-full h-36 bg-[url('../../assets/images/background.png')] bg-cover" />

      <SafeAreaView className="flex-1 justify-center px-8 mt-16">
        <Text className="text-3xl font-bold text-black text-center pt-7">Sign Up</Text>

        <View className="mt-8">
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Enter a valid email',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  className={`h-14 bg-gray-100 rounded-lg px-3 ${errors.email ? 'border border-error' : ''
                    }`}
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  className={`h-14 bg-gray-100 rounded-lg px-3 ${errors.password ? 'border border-error' : ''
                    }`}
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm Password is required',
              validate: (value) => value === password || 'Passwords must match',
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  className={`h-14 bg-gray-100 rounded-lg px-3 ${errors.confirmPassword ? 'border border-error' : ''
                    }`}
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        <TouchableOpacity className="h-14 bg-[#28a745] rounded-lg flex justify-center items-center mt-10" onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-lg font-bold">Sign Up</Text>
        </TouchableOpacity>

        <View className="mt-4 flex items-center">
          <Link className="text-[#007bff] text-sm underline mt-2" href="/">
            Already have an account? Login
          </Link>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

export default Signup;
