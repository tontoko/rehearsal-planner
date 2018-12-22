import LocationListScreen from '../screens/LocationListScreen';
import LocationCreateScreen from '../screens/LocationCreateScreen';
import LocationEditScreen from '../screens/LocationEditScreen';
import { createStackNavigator } from 'react-navigation';
import React from 'react'; 
import { Text } from 'react-native';

export default LocationStackNavigator = createStackNavigator({
	LocationListScreen: LocationListScreen,
	LocationCreateScreen: LocationCreateScreen,
	LocationEditScreen: LocationEditScreen,
}, {
	navigationOptions: {
		header: null,
	}
});