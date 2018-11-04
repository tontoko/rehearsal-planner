import ProjectScheduleListScreen from '../screens/ProjectScheduleListScreen';
import ScheduleCreateScreen from '../screens/ScheduleCreateScreen';
import ScheduleEditScreen from '../screens/ScheduleEditScreen';
import AdressListScreen from '../screens/AdressListScreen';
import ContactCreateScreen from '../screens/ContactCreateScreen';
import ProjectCreateScreen from '../screens/ProjectCreateScreen';
import ProjectEditScreen from '../screens/ProjectEditScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import { createStackNavigator } from 'react-navigation';
import React from 'react';
import { Text } from 'react-native';

export default ProjectStackNavigator = createStackNavigator({
	ProjectListScreen: ProjectListScreen,
	ProjectCreateScreen: ProjectCreateScreen,
	ProjectEditScreen: ProjectEditScreen,
	ProjectScheduleListScreen: ProjectScheduleListScreen,
	ScheduleCreateScreen: ScheduleCreateScreen,
	ScheduleEditScreen: ScheduleEditScreen,
	AdressListScreen: AdressListScreen,
	ContactCreateScreen: ContactCreateScreen,
}, {
	navigationOptions: {
		header: null,
	}
});