import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Thumbnail } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class ContactListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			contacts: [],
			loading: true,
		};
		currentUser = firebase.auth().currentUser;
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	componentWillMount() {
		db.collection('contacts').where(this.replaceAll(currentUser.email, '.', '%2E'), '==', true)
			.onSnapshot((snapShot) => {
				this.setState({ contacts: [], loading: true });
				if (snapShot.empty) {
					this.setState({ loading: false });
				} else {
					snapShot.docs.forEach((doc, i) => {
						const docData = Object.keys(doc.data());
						// const result = await docData.filter(e => currentUser.email);
						docData.forEach((userEmail) => {
							const replacedEmail = this.replaceAll(userEmail, '%2E', '.');
							if (replacedEmail !== currentUser.email) {
								db.collection('users').where('email', '==', replacedEmail)
									.get()
									.then((userDocs) => {
										if (snapShot.docs.length <= i+1) {
											this.setState({ contacts: [...this.state.contacts, { ...userDocs.docs[0].data(), id: doc.id }], loading: false });
										} else {
											this.setState({ contacts: [...this.state.contacts, { ...userDocs.docs[0].data(), id: doc.id }]});
										}
									});
							}
						});
					});
				}
			});
	}

	deleteRow(data, secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].props.closeRow();
		db.collection('contacts').doc(data.id)
			.delete()
			.then(() => {
				const contacts = this.state.contacts.filter(e => e.id !== data.id);
				this.setState({contacts});
			})
			.catch(error => {
				alert(error);
			});
	}

	render() {
		if (this.state.loading) {
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="menu" onPress={() => { this.props.navigation.openDrawer(); }
							} />
						</Left>
						<Body>
							<Title>コンタクト</Title>
						</Body>
					</Header>
					<LoadingScreen />
				</Container>
			);
		} else {
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="menu" onPress={() => { this.props.navigation.openDrawer(); }
							} />
						</Left>
						<Body>
							<Title>コンタクト</Title>
						</Body>
					</Header>
					<View style={{ flex: 1 }}>
						<Content>
							<List
								leftOpenValue={75}
								rightOpenValue={-75}
								dataSource={this.ds.cloneWithRows(this.state.contacts)}
								renderRow={data =>
									<ListItem avatar>
										<Left>
											<Thumbnail small style={{ marginLeft: '5%' }} source={{ uri: data.image ? data.image : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3' }} />
										</Left>
										<Body>
											<Text>{data.name}</Text>
											<Text note>{data.email}</Text>
										</Body>
									</ListItem>}
								renderLeftHiddenRow={data =>
									<Button full onPress={() => {
									}}>
										<Icon active name="information-circle" />
									</Button>}
								renderRightHiddenRow={(data, secId, rowId, rowMap) =>
									<Button full danger onPress={_ => this.deleteRow(data, secId, rowId, rowMap)}>
										<Icon active name="trash" />
									</Button>}
							/>
						</Content>
						<Fab
							containerStyle={{}}
							style={{ backgroundColor: '#5067FF' }}
							position="bottomRight"
							onPress={() => this.props.navigation.navigate('ContactCreateScreen', { navigateTo: 'ContactListScreen' })}
						>
							<Icon name="create" />
						</Fab>
					</View>
				</Container>
			);
		}
	}
} 