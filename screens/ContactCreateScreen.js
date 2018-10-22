import React from 'react';
import { StatusBar, ListView } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class ContactCreateScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			userList: [],
		};
	}

	componentWillMount() {

		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;

		// ユーザーリスト取得
		db.collection('users')
			.get().then((snapShot) => {
				let users = [];
				snapShot.forEach((doc) => {
					users.push(doc);
				});
				this.setState({ userList: users });
			});
	}

	createNewContact() {
		if (this.state.email) {
			if (!this.state.email.match(/.+@.+\..+/)) {
				alert('メールアドレスの形式が正しくありません');
				return false;
			}
			db.collection('users').where('email', '==', this.state.email)
				.get()
				.then((snapShot) => {
					let docs = [];
					snapShot.forEach(doc => {
						docs.push(doc.data());
					});
					if (docs.length <= 0) {
						if (this.state.name) {
							console.log('test1')
							this.addNewUser();
						} else {
							console.log('test2')
							alert('このユーザーは登録されていないため、名前を入力してください');
						}
					} else {
						console.log('test3')
						this.addContact(docs[0].email);
					}
				});
		} else {
			alert('必須項目が入力されていません');
		}
	}

	addNewUser() {
		db.collection('users').add({
			name: this.state.name,
			email: this.state.email,
		})
			.then(() => {
				this.addContact(this.state.email);
			})
			.catch((error) => {
				alert(error);
			});
	}

	addContact(targetEmail) {
		db.collection('contacts').add({
			[this.replaceAll(currentUser.email, '.', '%2E')]: true,
			[this.replaceAll(targetEmail,'.', '%2E')]: true,
		})
			.then(() => {
				this.props.navigation.goBack();
			})
			.catch((error) => {
				alert(error);
			});
	}

	replaceAll (str, before, after) {
		return str.split(before).join(after);
	}

	render() {
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
						} />
					</Left>
					<Body>
						<Title>新しい連絡先</Title>
					</Body>
				</Header>
				<Content>
					<Form style={{ marginVertical: '10%', marginHorizontal: '5%' }}>
						<List>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>名前</Label>
								<Input onChangeText={(text) => this.setState({ name: text })} value={this.state.name} />
							</Item>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>メールアドレス</Label>
								<Input keyboardType="email-address"
									autoCorrect={false}
									autoCapitalize="none" 
									onChangeText={(text) => this.setState({ email: text })} value={this.state.email} />
							</Item>
						</List>
					</Form>
				</Content>
				<Fab
					containerStyle={{}}
					style={{ backgroundColor: '#5067FF' }}
					position="bottomRight"
					onPress={() => this.createNewContact()}
				>
					<Icon name="add" />
				</Fab>
			</Container>
		);
	}
}