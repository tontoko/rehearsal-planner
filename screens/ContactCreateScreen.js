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
			ifExist: true,
		};
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}

	componentDidMount() {
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
					if (snapShot.docs.length == 0) {
						if (this.state.name) {
							this.addNewUser();
						} else {
							this.setState({ ifExist: false });
							alert('このユーザーは登録されていないため、名前を入力してください');
						}
					} else {
						this.setState({ ifExist: true });
						const { email, name, image } = snapShot.docs[0].data();
						this.addContact(email, name, image);
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
			registered: false,
			image: '',
		})
			.then(() => {
				this.addContact(this.state.email, this.state.name, '');
			})
			.catch((error) => {
				alert(error);
			});
	}

	addContact(email, name, image) {
		db.collection('contacts').add({
			[this.replaceAll(currentUser.email, '.', '%2E')]: true,
			[this.replaceAll(email,'.', '%2E')]: true,
		})
			.then(() => {
				const navigateTo = this.props.navigation.getParam('navigateTo', '');
				if (navigateTo == 'ContactListScreen') {
					this.props.navigation.goBack();
				} else {
					this.props.navigation.navigate(navigateTo, { newContact: {email, name, image}, type: 'newUser' });
				}
			})
			.catch((error) => {
				alert(error);
			});
	}

	replaceAll (str, before, after) {
		return str.split(before).join(after);
	}

	render() {
		const nameInput = () => {
			if (!this.state.ifExist) {
				return (
					<Item floatingLabel style={{ marginBottom: '1%' }}>
						<Label style={{ paddingTop: '1%', fontSize: 14 }}>名前</Label>
						<Input onChangeText={(text) => this.setState({ name: text })} value={this.state.name} />
					</Item>
				);
			}
		};

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
							{nameInput()}
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