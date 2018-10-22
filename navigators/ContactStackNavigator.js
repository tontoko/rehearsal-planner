import ContactListScreen from '../screens/ContactListScreen'; 
import ContactCreateScreen from '../screens/ContactCreateScreen'; 
import { createStackNavigator } from 'react-navigation';
import React from 'react'; 
import { Text } from 'react-native';


export default HomeStackNavigator = createStackNavigator({
    ContactListScreen: ContactListScreen,
    ContactCreateScreen: ContactCreateScreen,

}, {
    navigationOptions: {
        header: null,
    }
})