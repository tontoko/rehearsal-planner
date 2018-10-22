import ScheduleListScreen from '../screens/ScheduleListScreen'; 
import ScheduleCreateScreen from '../screens/ScheduleCreateScreen'; 
import ScheduleEditScreen from '../screens/ScheduleEditScreen';
import AdressListScreen from '../screens/AdressListScreen';
import { createStackNavigator } from 'react-navigation';
import React from 'react'; 
import { Text } from 'react-native';

export default HomeStackNavigator = createStackNavigator({
    ScheduleListScreen: ScheduleListScreen,
    ScheduleCreateScreen: ScheduleCreateScreen,
    ScheduleEditScreen: ScheduleEditScreen,
    AdressListScreen: AdressListScreen,

}, {
    navigationOptions: {
        header: null,
    }
})