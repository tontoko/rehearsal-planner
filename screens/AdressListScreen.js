import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { View, ListItem, List, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input, Spinner, Thumbnail, Fab } from 'native-base';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';

let db;
let currentUser;

export default class AdressListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listData: [],
			loading: true,
			selected: [],
			toScreen: '',
			participants: [],
		};
	}

	async componentWillMount() {
		// ユーザーと選択済みリストを取得
		const selected = this.props.navigation.getParam('selected', []);
		const type = this.props.navigation.getParam('type', '');
		this.setState({ selected }); 
		this.setState({ toScreen: type == 'create' ? 'ScheduleCreateScreen' : 'ScheduleEditScreen' })
		const participants = this.props.navigation.getParam('participants', []);
		this.setState({participants});
		const db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		currentUser = firebase.auth().currentUser;
		db.settings(settings);
		// アドレスリスト取得
		db.collection('contacts').where(this.replaceAll(currentUser.email, '.', '%2E'), '==', true)
			.get()
			.then(async (snapShot) => {
				this.setState({ listData: [] });
				if (snapShot.empty) {
					this.setState({ loading: false });
				} else {
					snapShot.forEach(doc => {
						const docData = Object.keys(doc.data());
							docData.forEach(userEmail => {
							const replacedEmail = this.replaceAll(userEmail, '%2E', '.');
							if (replacedEmail !== currentUser.email) {
								db.collection('users').where('email', '==', replacedEmail)
									.get()
									.then((userDocs) => {
										userDocs.forEach(userDoc => {
											this.setState({ listData: [...this.state.listData, { ...userDoc.data(), id: doc.id }] });
										})
										if (this.state.listData.length == 1) {
											this.setState({ loading: false });
										}
									});
								}
							});
						})
				}
			});
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	ifChecked(filterEmail) {
		const filtered = this.state.selected.filter(n => n.email == filterEmail);
		if (filtered.length == 0) {
			return false;
		} else {
			return true;
		}
	}

	checkBox(user) {
		const result = this.state.participants.filter(e => e.id == user.id)
		if (result.length > 0 ) {
			return
		} else {
			return (
				<CheckBox
					onPress={() => {
						if (!this.ifChecked(user.email)) {
							const added = [...this.state.selected, user];
							this.setState({ selected: added });
						} else {
							const deleted = this.state.selected.filter(n => n.id !== user.id);
							this.setState({ selected: deleted });
						}
					}}
					checked={this.ifChecked(user.email)}
				/>
			);
		}
	}

	render() {
		if (!this.state.loading) {
			let list = [];
			this.state.listData.forEach(e => {
				list.push((
					<ListItem thumbnail key={e.id}>
						<Left>
							<Thumbnail square source={{ uri: e.image }} />
						</Left>
						<Body>
							<Text>{e.name}</Text>
							<Text note numberOfLines={1}>{e.email}</Text>
						</Body>
						<Right>
							{this.checkBox(e)}
						</Right>
					</ListItem>
				));
			});
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
							} />
						</Left>
						<Body>
							<Title>アドレス帳</Title>
						</Body>
					</Header>
					<Content>
						<List>
							{list}
						</List>
					</Content>
					<Fab
						containerStyle={{}}
						style={{ backgroundColor: '#5067FF' }}
						position="bottomRight"
						onPress={() => this.props.navigation.navigate(this.state.toScreen, { selected: this.state.selected, type: 'selected' })}
					>
						<Icon name="add" />
					</Fab>
				</Container>
			);
		} else {
			return (
				<Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Spinner />
				</Container>
			);
		}
		
	}
}