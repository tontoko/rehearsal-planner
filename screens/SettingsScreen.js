import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Thumbnail } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class SettingScreen extends React.Component {
	constructor(props) {
		super(props);
		currentUser = firebase.auth().currentUser;
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	render() {
		const changePassword = () => {
			const provider = currentUser.providerData[0].providerId;
			if (provider == 'password') {
				return (
					<View style={{ marginTop: '4%' }}>
						<Button onPress={() =>
							this.props.navigation.navigate('UpdateUserDataScreen')
						}>
							<Text>登録情報の変更</Text>
						</Button>
					</View>
				);
			}
		};
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="menu" onPress={() => { this.props.navigation.openDrawer(); }
						} />
					</Left>
					<Body>
						<Title>設定</Title>
					</Body>
				</Header>
				<Content>
					<View style={{ alignItems: 'center' }}>
						<Thumbnail style={{ marginTop: '5%' }} source={{
							uri: currentUser.photoURL ? currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3',
						}} />
						<Text style={{ marginVertical: 6, fontSize: 22 }}>{currentUser.displayName}</Text>
						<Text style={{ fontSize: 18 }}>{currentUser.email}</Text>
						{changePassword()}
						<View style={{ marginTop: '4%' }}>
							<Button onPress={() =>
								firebase.auth().signOut()
							}>
								<Text>ログアウト</Text>
							</Button>
						</View>
					</View>
				</Content>
			</Container>
		);
	}	
} 