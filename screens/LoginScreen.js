import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import { NavigationActions, StackActions } from 'react-navigation';

let db;

export default class LoginScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	login() {
		const email = this.state.email;
		const password = this.state.password;
		this.props.screenProps.newLogin();

		if (email && password) {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					this.saveUserData();
				})
				.catch((error) => {
					const errorMessage = error.message;
					alert(errorMessage);
				});
		} else {
			alert('ユーザー名とパスワードを入力してください');
		}
	}

	async facebookLogin() {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
			'496025710872464',
			{ permissions: ['public_profile', 'email', 'user_friends'] }
		)
		.catch((error) => {
			alert(error);
		});

		if (type === 'success') {
			const credential = firebase.auth.FacebookAuthProvider.credential(token);
			this.props.screenProps.newLogin();

			// const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
			await firebase.auth().signInAndRetrieveDataWithCredential(credential)
				.then(() => {
					this.saveUserData(token);
				})
				.catch(() => {
					alert('エラーが発生しました');
				});
		}
	}

	async googleLogin() {
		const result = await Expo.Google.logInAsync({
			androidClientId: '460431429680-tpbn5maqhjhbgb8dhrnad6l4uig460mq.apps.googleusercontent.com',
			iosClientId: '460431429680-iacbej0tutia28puftcvqgos3pv1go2h.apps.googleusercontent.com',
			scopes: ['profile', 'email'],
		});

		const { accessToken, type } = result;

		if (type === 'success') {
			// const credential = firebase.auth.GoogleAuthProvider.credential(result.accessToken);

			const credential = firebase.auth.GoogleAuthProvider.credential(result);
			this.props.screenProps.newLogin();

			await firebase.auth().signInAndRetrieveDataWithCredential(credential)
				.then(() => {
					this.saveUserData(accessToken);
				})
				.catch((e) => {
					// alert('エラーが発生しました');
					alert(e);
				});
		}
	}

	async saveUserData(token) {
		user = firebase.auth().currentUser;
		const provider = user.providerData[0].providerId;
		const profile = user.providerData[0];

		await db.collection('users').where('email', '==', user.email)
			.get()
			.then(async (snapShot) => {
				let targetUser;
				await Promise.all(snapShot.docs.map((async e => {
					targetUser = e;
				})));
				if (!targetUser) {
					// ユーザー情報を記録
					if (token && provider == 'facebook.com') {
						db.collection('users').doc(user.uid).set({
							id: user.uid,
							email: user.email,
							image: user.photoURL,
							name: user.displayName,
							accessToken: token,
							facebookId: profile.uid,
						})
							.then(() => {
								this.props.screenProps.newLogin();
							})
					} else if (token) {
						db.collection('users').doc(user.uid).set({
							id: user.uid,
							email: user.email,
							image: user.photoURL,
							name: user.displayName,
							accessToken: token,
						})
							.then(() => {
								this.props.screenProps.newLogin();
							})
					} else {
						db.collection('users').doc(user.uid).set({
							id: user.uid,
							email: user.email,
							image: '',
							name: user.displayName,
						})
							.then(() => {
								this.props.navigation.navigate('DisplayNameSettingScreen', { id: user.uid });
							})
					}
				} else {
					// ユーザー情報を記録
					if (token && provider == 'facebook.com') {
						db.collection('users').doc(targetUser.data().id).update({
							id: user.uid,
							email: user.email,
							image: user.photoURL,
							name: user.displayName,
							accessToken: token,
							facebookId: profile.uid,
						})
							.then(() => {
								this.props.screenProps.newLogin();
							})
					} else if (token) {
						db.collection('users').doc(targetUser.data().id).update({
							id: user.uid,
							email: user.email,
							image: user.photoURL,
							name: user.displayName,
							accessToken: token,
						})
							.then(() => {
								this.props.screenProps.newLogin();
							})
					} else {
						db.collection('users').doc(targetUser.data().id).update({
							id: user.uid,
							email: user.email,
							image: user.photoURL,
							name: targetUser.data().name,
						})
							.then(() => {
								if (targetUser.data().registered) {
									this.props.screenProps.newLogin();
								} else {
									this.props.navigation.navigate('DisplayNameSettingScreen', { id: targetUser.data().id });
								}
							})
					}
				}
			})
	}

	onLayout() {
		// 端末回転時
		this.setState({
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		});
	}

	render() {
		return (
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0, }}>
				<Header>
					<Title style={{ alignSelf: 'center' }}>ログイン</Title>
				</Header>
				<Form style={{
					flex: 1,
					justifyContent: 'space-around',
					marginVertical: this.state.height>=this.state.width ? this.state.height / 8 : 0, 
					marginHorizontal: this.state.width / 10 
				}}>
					<Item floatingLabel>
						<Label style={{ paddingTop: '1%', fontSize: 14}}>メールアドレス</Label>
						<Input keyboardType="email-address"
							autoCorrect={false}
							autoCapitalize="none" 
							value={this.state.email} 
							onChangeText={(text) => this.setState({ email: text })}></Input>
					</Item>
					<Item floatingLabel>
						<Label style={{ paddingTop: '1%', fontSize: 14 }}>パスワード</Label>
						<Input secureTextEntry 
						value={this.state.password} 
						onChangeText={(text) => this.setState({ password: text })}></Input>
					</Item>
					<View style={{ 
						alignSelf: this.state.height >= this.state.width ? 'flex-end' : 'flex-start',
						flex: 1, 
						justifyContent: 'space-around', 
						flexDirection: this.state.height >= this.state.width ? 'column' : 'row', 
						width: '100%',
						paddingBottom: this.state.height >= this.state.width ? '10%' : '5%',
						paddingTop: this.state.height >= this.state.width ? '5%' : 0,
					}}>
						<Button style={{ alignSelf: 'flex-end', }} onPress={() => this.login()}><Text>ログイン</Text></Button>
						<Button iconLeft light style={{ alignSelf: 'flex-end', }} onPress={() => this.props.navigation.navigate('signUp')}>
							<Icon name='md-mail' />
							<Text>E-Mail</Text>
						</Button>
						<Button iconLeft danger style={{ alignSelf: 'flex-end', }} onPress={() => this.googleLogin()}>
							<Icon name='logo-google' />
							<Text>Google</Text>
						</Button>
						<Button iconLeft style={{ alignSelf: 'flex-end', }} onPress={() => this.facebookLogin()}>
							<Icon name='logo-facebook' />
							<Text>Facebook</Text>
						</Button>
					</View>
				</Form>
			</Container>
		);
	}
}
