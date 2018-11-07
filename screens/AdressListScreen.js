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
			selected: this.props.navigation.getParam('selected', []),
			toScreen: this.props.navigation.getParam('navigateTo', []),
			participants: this.props.navigation.getParam('participants', []),
		};
	}

	async componentDidMount() {
		// ユーザーと選択済みリストを取得
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
					snapShot.docs.forEach((doc, i) => {
						const docData = Object.keys(doc.data());
							docData.forEach(userEmail => {
							const replacedEmail = this.replaceAll(userEmail, '%2E', '.');
							if (replacedEmail !== currentUser.email) {
								db.collection('users').where('email', '==', replacedEmail)
									.get()
									.then((userDocs) => {
										const { name, image, email } = userDocs.docs[0].data();
										this.setState({ listData : [...this.state.listData, { name, image, email }] });
										if (snapShot.docs.length == i + 1) {
											// Facebookの友達リストからすでに登録されている連絡先をフィルター
											if (this.props.screenProps.facebookFriends) {
												const facebookFriends = this.props.screenProps.facebookFriends;
												let filteredList = [];
												this.props.screenProps.facebookFriends.forEach(async (facebook, i) => {
													filteredList = await this.state.listData.filter(e => e.email != facebook.email);
													if (facebookFriends.length == i + 1) {
														this.setState({ listData: [...filteredList, ...facebookFriends], loading: false });
													}
												})
											} else {
												this.setState({ loading: false });
											}
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
		const result = this.state.participants.filter(e => e.email == user.email)
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
							const deleted = this.state.selected.filter(n => n.email !== user.email);
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
			this.state.listData.forEach((e, i) => {
				list.push((
					<ListItem thumbnail key={i}>
						<Left>
							<Thumbnail small source={{ uri: e.image ? e.image : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3' }} />
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