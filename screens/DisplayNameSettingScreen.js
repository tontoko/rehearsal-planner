import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar, Dimensions } from 'react-native';
import * as firebase from 'firebase';

let db, currentUser;

export default class DisplayNameSettingScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
		currentUser = firebase.auth().currentUser;
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
    }
    
    onLayout() {
        // 端末回転時
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
    }

    async submit() {
        await user.updateProfile({
            displayName: this.state.name,
		})
		.then(() => {
			db.collection('users').doc(this.props.navigation.getParam('id', '')).update({
				name: this.state.name,
				registered: true,
			})
				.then(() => {
					this.props.screenProps.updateDisplayName();
				})
		})
		.catch((error) => {
			alert(error);
			return false;
		});

    }

	render() {
		return (
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0, }}>
				<Header>
					<Title style={{ alignSelf: 'center' }}>表示する名前の設定</Title>
				</Header>
				<Form style={{
                    flex: 1, justifyContent: 'space-around',
                    marginVertical: this.state.height >= this.state.width ? this.state.height / 5 : 0,
                    marginHorizontal: this.state.width / 10 
                }}>
					<Item floatingLabel>
						<Label>表示名</Label>
                        <Input value={this.state.name} onChangeText={(text) => this.setState({ name: text })}></Input>
					</Item>
					<Button style={{ alignSelf: 'flex-end', }} onPress={() => this.submit()}><Text>決定</Text></Button>
				</Form>
			</Container>
		);
	}
}
