import HomeStackNavigator from './HomeStackNavigator';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import SettingsScreen from '../screens/SettingsScreen';
import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import { ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';

const ConnectedComponent = (props) => (
	<Content>
		<Header style={{ height: 200, backgroundColor: '#4CAF50' }}>
			<Body>
				<Thumbnail source={{ uri: props.user.user.photoURL }} />
				<Text style={{marginVertical: 6, color: 'white', fontSize: 18}}>{props.user.user.displayName}</Text>
				<Text style={{ color: 'white', fontSize: 14 }}>{props.user.user.email}</Text>
			</Body>
		</Header>
		<ScrollView>
			<DrawerItems {...props} />
		</ScrollView>
	</Content>
);

const mapStateToProps = (state) => {
	return state;
};
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(Actions, dispatch);
};

const CustomDrawerComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent);

export default AppDrawerNavigator = createDrawerNavigator({
	Home: HomeStackNavigator,
	Settings: SettingsScreen,
}, {
	contentComponent: CustomDrawerComponent,
});