import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View } from 'native-base';
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
			.get()
			.then((snapShot) => {
				this.setState({ contacts: [] });
				if (snapShot.empty) {
					this.setState({ loading: false });
				} else {
					snapShot.forEach(doc => {
						const docData = Object.keys(doc.data());
						// const result = await docData.filter(e => currentUser.email);
						docData.forEach((userEmail) => {
							const replacedEmail = this.replaceAll(userEmail, '%2E', '.');
							if (replacedEmail !== currentUser.email) {
								db.collection('users').where('email', '==', replacedEmail)
									.get()
									.then((userDocs) => {
										userDocs.forEach(userDoc => {
											this.setState({ contacts: [...this.state.contacts, { ...userDoc.data(), id: doc.id }], loading: false });
										});
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
			return (<LoadingScreen />);
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
									<ListItem>
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
							onPress={() => this.props.navigation.navigate('ContactCreateScreen')}
						>
							<Icon name="create" />
						</Fab>
					</View>
				</Container>
			);
		}
	}
} 