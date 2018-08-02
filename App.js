import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import {createDrawerNavigator, DrawerItems, createStackNavigator} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Header, Left, Right, Icon, Container, Button, Body, Title, Text } from 'native-base';
import { Font, AppLoading } from "expo";


export default class App extends React.Component {
  state = {
    fontLoaded: false,
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
      return (
        <Container>
        {
          this.state.fontLoaded ? (
          <AppDrawerNavigator />
            ) : <AppLoading />
        }
        </Container>
      );
  }
}

export class Test extends React.Component {
  render() {
    return (
      <Text>Test</Text>
    );
  }
}

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex:1}}>
    <View style={{height: 150, backgroundColor: 'white', alignItems:'center', justifyContent: 'center',}}>
      <Text>CustomedHeader</Text>
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)

const stack = createStackNavigator({
  Home: HomeScreen,
  Test: Test,
})

const AppDrawerNavigator = createDrawerNavigator({
  Home: stack,
  Settings: SettingsScreen,
}, {
  contentComponent: CustomDrawerComponent,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
