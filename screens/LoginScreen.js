import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar, Dimensions } from 'react-native';
import * as firebase from 'firebase';

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
	}

	componentWillMount() {
		if (this.props.ifSaveEmail.saved) {
			this.setState({email: this.props.ifSaveEmail.email});
		}
	}

	login() {
		const email = this.state.email;
		const password = this.state.password;
		if (this.props.ifSaveEmail.saved) {
			this.props.saveEmail(email);
		} else{
			this.props.saveEmail('');
		}
		if (email && password) {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.catch((error) => {
					const errorMessage = error.message;
					alert(errorMessage);
				});
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

	render() {
		return (
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0, }}>
				<Header>
					<Title style={{ alignSelf: 'center' }}>ログイン</Title>
				</Header>
				<Form style={{
					flex: 1, justifyContent: 'space-around',
					marginVertical: this.state.height>=this.state.width ? this.state.height / 5 : 0, 
					marginHorizontal: this.state.width / 10 
				}}>
					<Item floatingLabel>
						<Label>メールアドレス</Label>
						<Input autoCapitalize='none' value={this.state.email} onChangeText={(text) => this.setState({ email: text })}></Input>
					</Item>
					<Item floatingLabel>
						<Label>パスワード</Label>
						<Input secureTextEntry value={this.state.password} onChangeText={(text) => this.setState({ password: text })}></Input>
					</Item>
					<ListItem style={{}}>
						<CheckBox checked={this.props.ifSaveEmail.saved} onPress={() => { this.props.togleSaveEmail(); }} />
						<Body>
							<Text style={{ fontSize: 14, color: 'gray' }}>メールアドレスを記憶</Text>
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