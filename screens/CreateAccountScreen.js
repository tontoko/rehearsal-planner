import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar, Dimensions } from 'react-native';
import * as firebase from 'firebase';

let db;

export default class CreateAccountScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			checkPassword: '',
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	createAccount() {
		this.props.screenProps.newLogin();
		const email = this.state.email;
		const password = this.state.password;
		const check = this.state.checkPassword;
		if (email && password && check) {
			if (password == check) {
				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(() => {
						this.saveUserData();
					})
					.catch(() => {
						alert('エラーが発生しました');
					});
			} else {
				alert('パスワードが一致しません');
			}
		} else {
			alert('ユーザー名とパスワードを入力してください');
		}
	}

	onLayout() {
		// 端末回転時
		this.setState({
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		});
	}


	async saveUserData() {
		user = firebase.auth().currentUser;

		await db.collection('users').where('email', '==', user.email)
			.get()
			.then(async (snapShot) => {
				let targetUser;
				await snapShot.forEach(async doc => {
					targetUser = doc;
				});
				if (!targetUser) {
					// ユーザー情報を記録
					db.collection('users').doc(user.uid).set({
						id: user.uid,
						email: user.email,
						image: user.photoURL,
						name: user.displayName,
					})
						.then(() => {
							this.props.screenProps.newLogin();
						})
				} else {
					// ユーザー情報を記録
					db.collection('users').doc(targetUser.id).update({
						id: user.uid,
					})
						.then(() => {
							user.updateProfile({
								displayName: targetUser.data().name,
							})
								.then(() => {
									this.props.screenProps.newLogin();
								})
						})
				}
			})
	}

	render() {
		return (
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0, }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
						} />
					</Left>
					<Body>
						<Title>新規アカウント</Title>
					</Body>
				</Header>
				<Form style={{
					flex: 1, justifyContent: 'space-around',
					marginTop: this.state.height >= this.state.width ? this.state.height / 10 : 0, 
					marginBottom: this.state.height >= this.state.width ? this.state.height / 3 : 0, 
					marginHorizontal: this.state.width / 10 
				}}>
					<Item floatingLabel>
						<Label style={{ paddingTop: '1%', fontSize: 14 }}>メールアドレス</Label>
						<Input 
							keyboardType="email-address"
							autoCorrect={false}
							autoCapitalize="none" 
							value={this.state.email} 
							onChangeText={(text) => this.setState({ email: text })}
						></Input>
					</Item>
					<Item floatingLabel>
						<Label style={{ paddingTop: '1%', fontSize: 14 }}>パスワード</Label>
						<Input secureTextEntry value={this.state.password} onChangeText={(text) => this.setState({ password: text })}></Input>
					</Item>
					<Item floatingLabel>
						<Label style={{ paddingTop: '1%', fontSize: 14 }}>パスワードを再度入力</Label>
						<Input secureTextEntry value={this.state.checkPassword} onChangeText={(text) => this.setState({ checkPassword: text })}></Input>
					</Item>
					<Button style={{ alignSelf: 'flex-end', }} onPress={() => this.createAccount()}><Text>作成</Text></Button>
				</Form>
			</Container>
		);
	}
}