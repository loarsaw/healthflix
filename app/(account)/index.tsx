import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, Image, Modal, TouchableOpacity, ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getItem, setItem } from '@/utils/asyncStorage';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux/userSlice/slice';
import { RootState } from '@/redux/store';
import { off, on } from '@/redux/asyncSlice/slice';

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .regex(/^[A-Za-z]+$/, { message: 'First name must only contain letters' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .regex(/^[A-Za-z]+$/, { message: 'Last name must only contain letters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' }),
  dateOfJoining: z
    .string()
    .min(1, { message: 'Date of joining is required' }),

});

type AccountDetails = z.infer<typeof schema>;

const AccountPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.async);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AccountDetails>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfJoining: '',
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAvatar, setNewAvatar] = useState('https://via.placeholder.com/100');

  const handleSaveAvatar = () => {
    setIsModalVisible(false);
  };

  const onSubmit = async (data: AccountDetails) => {

    try {
      const token = await getItem('accessToken');
      const fullName = data.firstName + ' ' + data.lastName
      await axiosInstance.post('/update-user', { fullName, newAvatar }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  async function fetchUserData() {
    dispatch(on());
    const token = await getItem('accessToken');
    if (!token) {
      dispatch(off());
      router.push('/signin');
      return;
    }
    const { data } = await axiosInstance.get('/get-user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data.userData)
    dispatch(addUser({ email: data.userData.email }));
    setValue('email', data.userData.email || '');
    setValue('dateOfJoining', data.userData.createdAt || '');
    setValue('firstName', data.userData.name.split(" ")[0] || '');
    setValue('lastName', data.userData.name.split(" ")[1] || '');
    setNewAvatar(data.userData.avatar || 'https://via.placeholder.com/100');
    const formattedDate = new Date(data.userData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setValue('dateOfJoining', formattedDate);

    dispatch(off());
  }

  useEffect(() => {
    (async () => {
      try {
        fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
        dispatch(off());
      }
    })();
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View className="bg-white p-5 rounded-xl shadow-lg flex-1">
        <Text className="text-3xl font-bold text-center mb-6 text-gray-700">Account Details</Text>

        {/* Avatar Section */}
        <View className="items-center mb-6 mt-2">
          <Image source={{ uri: newAvatar }} className="w-30 h-30 rounded-full border-4 border-yellow-500 mb-4" />
          <TouchableOpacity
            className="bg-red-500 px-5 py-2 rounded-full shadow-md"
            onPress={() => setIsModalVisible(true)}
          >
            <Text className="text-white font-semibold text-lg">Edit Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Disabled fields such as email and date of joining */}
        {[
          { label: 'First Name', name: 'firstName', keyboardType: 'default', editable: true },
          { label: 'Last Name', name: 'lastName', keyboardType: 'default', editable: true },
          { label: 'Email', name: 'email', keyboardType: 'email-address', editable: false },
          { label: 'Date of Joining', name: 'dateOfJoining', keyboardType: 'default', editable: false },
        ].map(({ label, name, keyboardType, editable }) => (
          <View className="mb-6 bg-gray-200 p-3 rounded-md border border-gray-300 shadow-sm" key={name}>
            <Text className="text-lg font-semibold text-gray-600 mb-2">{label}</Text>
            <Controller
              control={control}
              name={name as keyof AccountDetails}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  editable={editable}
                  className={`h-12 border rounded-lg p-3 bg-white text-gray-700 ${errors[name as keyof AccountDetails] ? 'border-red-500' : 'border-gray-300'}`}
                  value={value}
                  onChangeText={onChange}
                  keyboardType={keyboardType as any}
                />
              )}
            />
            {errors[name as keyof AccountDetails] && (
              <Text className="text-red-500 text-xs mt-1">{errors[name as keyof AccountDetails]?.message}</Text>
            )}
          </View>
        ))}

        <Button title="Save Changes" onPress={handleSubmit(onSubmit)} />

        <View className="mt-4">
          <Button
            title="Log Out"
            color="red"
            onPress={() => {
              setItem('accessToken', null);
              router.push('/signin');
            }}
          />
        </View>

        {/* Avatar Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="w-4/5 bg-white rounded-lg p-5 shadow-lg">
              <Text className="text-xl font-bold text-gray-700 mb-4">Edit Avatar</Text>
              <TextInput
                className="h-12 border rounded-lg p-3 bg-white text-gray-700 mb-4"
                placeholder="Enter Avatar URL"
                value={newAvatar}
                onChangeText={setNewAvatar}
              />
              <View className="flex-row justify-around">
                <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                <Button title="Save" onPress={handleSaveAvatar} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default AccountPage;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: '#F4F4F9',
  },
})