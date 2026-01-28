import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen1 from "./screen1";
import Screen2 from "./screen2";
import Screen3 from "./screen3";

const SCREENS = [Screen1, Screen2, Screen3];
const { width } = Dimensions.get("window");

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/auth/start");
  };

  const goNext = () => {
    if (currentIndex < SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SCREENS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: Item }) => (
          <View style={{ width }}>
            <Item onNext={goNext} onSkip={completeOnboarding} />
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(index);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
