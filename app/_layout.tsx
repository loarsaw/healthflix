import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider as StoreProvider } from 'react-redux'
import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/redux/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import "../global.css"
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs>
          <Tabs.Screen
            options={{
              headerShown: false,
              title: "Home",
              tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home-filled" color={color} />
            }}
            name="(dashboard)" />

          <Tabs.Screen
            options={{
              href: null,
            }}
            name="index" />
          <Tabs.Screen
            options={{
              headerShown: false,
              title: "History",
              tabBarIcon: ({ color }) => <MaterialIcons size={28} name="list" color={color} />
            }}
            name="(history)" />
          <Tabs.Screen
            options={{
              headerShown: false,
              title: "Account",
              tabBarIcon: ({ color }) => <MaterialIcons size={28} name="verified-user" color={color} />

            }}
            name="(account)" />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </StoreProvider>

  );
}
