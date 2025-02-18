import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Link, router } from 'expo-router'
import axiosInstance from '@/utils/axiosInstance';
import { setItem } from '@/utils/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { off, on } from '@/redux/asyncSlice/slice';
import { RootState } from '@/redux/store';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch()
  const { loading } = useSelector((state: RootState) => state.async)
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
      // Alert.alert();
    } else {
      try {

        dispatch(on())
        const { data } = await axiosInstance.post("/sign-in", { email, password });
        await setItem("accessToken", data.accessToken);
        await setItem("refreshToken", data.refreshToken);
        dispatch(off())
        router.push("/(dashboard)/home");
      } catch (error) {
        dispatch(off())
        Alert.alert("Try Again")
      }

    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-5 text-gray-800">Login</Text>
      <View className="w-full mb-5">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`w-full h-12 border border-gray-300 rounded-lg p-2 mb-2 bg-white text-lg ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: 'Invalid email address',
            },
          }}
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`w-full h-12 border border-gray-300 rounded-lg p-2 mb-2 bg-white text-lg ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
            />
          )}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          }}
        />
      </View>

      <TouchableOpacity
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-5"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-lg font-bold">
          {loading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View className="items-center">
        <Text
          className="text-blue-600 text-sm underline"
          onPress={() => Alert.alert('Navigate', 'Forgot Password Screen')}
        >
          Forgot Password?
        </Text>
        <Link
          href={"/signup"}
          className="text-blue-600 text-sm underline mt-2"
        >
          Don’t have an account? Sign up
        </Link>
      </View>
    </View>
  );
};

export default Login;
