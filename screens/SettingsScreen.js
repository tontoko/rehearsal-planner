import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';

class Screen extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Button onPress={() => 
					firebase.auth().signOut().then(() => {
						this.props.logOut();
					})
				}>
					<Text>ログアウト</Text>
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const mapStateToProps = (state) => {
	return state;
};
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(Actions, dispatch);
};

export default SettingsScreen = connect(mapStateToProps, mapDispatchToProps)(Screen);