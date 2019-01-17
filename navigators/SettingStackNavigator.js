import SettingsScreen from '../screens/SettingsScreen'; 
import UpdateUserDataScreen from '../screens/UpdateUserDataScreen'; 
import { createStackNavigator } from 'react-navigation';
import React from 'react'; 
import { Text } from 'react-native';


export default SettingStackNavigator = createStackNavigator({
    SettingsScreen: SettingsScreen,
    UpdateUserDataScreen: UpdateUserDataScreen,

}, {
    navigationOptions: {
        header: null,
    }
})