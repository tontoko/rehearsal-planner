import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar } from 'react-native';
import * as firebase from 'firebase';

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
	}

	login() {
		const email = this.state.email;
		const password = this.state.password;
		if (email && password) {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					alert('code: ' + errorCode + "<br>" + errorMessage);
				});
		} else {
			alert('ユーザー名とパスワードを入力してください');
		}
	}

	render() {
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Title style={{ alignSelf: 'center' }}>ログイン</Title>
				</Header>
				<Form style={{ flex: 1, justifyContent: 'space-around', marginVertical: '20%', marginHorizontal: '10%' }}>
					<Item floatingLabel>
						<Label>メールアドレス</Label>
						<Input autoCapitalize='none' value={this.state.email} onChangeText={(text) => this.setState({email: text})}></Input>
					</Item>
					<Item floatingLabel>
						<Label>パスワード</Label>
						<Input secureTextEntry value={this.state.password} onChangeText={(text) => this.setState({ password: text })}></Input>
					</Item>
					<ListItem style={{}}>
						<CheckBox checked={this.props.ifSavePassword.saved} onPress={() => { this.props.savePassword(); }} />
						<Body>
							<Text style={{ fontSize: 14, color: 'gray' }}>パスワードを記憶</Text>
						</Body>
					</ListItem>
					<Button style={{ alignSelf: 'flex-end', }} onPress={() => this.login()}><Text>ログイン</Text></Button>
				</Form>
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
	return state;
};
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(Actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);