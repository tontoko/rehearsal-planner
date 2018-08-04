import HomeScreen from '../screens/HomeScreen';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import React from 'react';

export class Test extends React.Component {
    render() {
        return (
            <Text>Test</Text>
        );
    }
}

export default HomeStackNavigator = createStackNavigator({
    Home: HomeScreen,
    Test: Test,
})