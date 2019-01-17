import HomeStackNavigator from './HomeStackNavigator';
import ContactStackNavigator from './ContactStackNavigator';
import ProjectStackNavigator from './ProjectStackNavigator';
import LocationStackNavigator from './LocationStackNavigator';
import SettingStackNavigator from './SettingStackNavigator';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import SettingsScreen from '../screens/SettingsScreen';
import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import { ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import firebase from 'firebase';
require('firebase/firestore');

const Drawer = (props) => {
	const db = firebase.firestore();
	const settings = { timestampsInSnapshots: true };
	db.settings(settings);
	const user = firebase.auth().currentUser;
	let displayName, email, photoURL;
	if (user && user.photoURL)  {
		displayName = user.displayName;
		email = user.email;
		photoURL = user.photoURL;
	} else if (user) {
		displayName = user.displayName;
		email = user.email;
		photoURL = 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3';
	} 
	return (
		<Content>
			<Header style={{ height: 200, backgroundColor: '#4CAF50' }}>
				<Body>
					<Thumbnail source={{ 
						uri:  photoURL,
					}} />
					<Text style={{marginVertical: 6, color: 'white', fontSize: 18}}>{displayName}</Text>
					<Text style={{ color: 'white', fontSize: 14 }}>{email}</Text>
				</Body>
			</Header>
			<ScrollView>
				<DrawerItems {...props} />
			</ScrollView>
		</Content>
	);
};

export default AppDrawerNavigator = createDrawerNavigator({
	Home: HomeStackNavigator,
	Project: ProjectStackNavigator,
	Contact: ContactStackNavigator,
	Location: LocationStackNavigator,
	Settings: SettingStackNavigator,
}, {
	contentComponent: Drawer,
});