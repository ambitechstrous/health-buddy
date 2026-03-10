import { StyleSheet, Text, View } from "react-native";
import { MealPlanScreen, NavBar } from "../components";

// Primary landing page for meal plan app.
// TODO: Connect this to real backend and add more functionality. Currently only a read-only view with mocked out data.
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <NavBar/>
        <MealPlanScreen/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
