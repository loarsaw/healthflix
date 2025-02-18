import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import "../global.css";
import { TimerProvider } from "@/context/Provider";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <TimerProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Tabs>
          <Tabs.Screen
            options={{
              headerShown: false,
              title: "Home",
              tabBarIcon: ({ color }) => (
                <MaterialIcons size={28} name="home-filled" color={color} />
              ),
            }}
            name="(dashboard)"
          />

          <Tabs.Screen
            options={{
              href: null,
            }}
            name="index"
          />
          <Tabs.Screen
            options={{
              headerShown: false,
              title: "History",
              tabBarIcon: ({ color }) => (
                <MaterialIcons size={28} name="list" color={color} />
              ),
            }}
            name="(history)"
          />
        
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TimerProvider>
  );
}
