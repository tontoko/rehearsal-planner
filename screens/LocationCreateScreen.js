import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class LocationCreateScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			equipments: [],
		};
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}

	createNewLocation() {
		if (this.state.name) {
			db.collection('users').doc(currentUser.uid).collection('locations').where('name', '==', this.state.name)
				.get()
				.then((snapShot) => {
					if (snapShot.docs.length >= 1) {
						Alert.alert(
							'確認',
							'すでに登録されているロケーションです。上書きしますか？',
							[
								{ text: 'はい', onPress: () => this.updateLocation(snapShot.docs[0].id) },
								{ text: 'いいえ', onPress: () => { return false; } }
							],
							{ cancelable: false }
						);
					} else {
						this.addNewLocation();
					}
				});
		} else {
			alert('必須項目が入力されていません');
		}
	}

	addNewLocation() {
		db.collection('users').doc(currentUser.uid).collection('locations').add({
			name: this.state.name,
			equipments: this.state.equipments,
		})
			.then(() => {
				this.props.navigation.goBack();
			})
			.catch((error) => {
				alert(error);
			});
	}

	updateLocation(id) {
		db.collection('users').doc(currentUser.uid).collection('locations').doc(id).update({
			name: this.state.name,
			equipments: this.state.equipments,
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
		const equipments = () => {
			let render = [];
			this.state.equipments.forEach((e, i) => {
				render.push(
					<ListItem key={i}>
						<Body>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>備品名</Label>
								<Input onChangeText={(text) => {
									let equipments = this.state.equipments.concat();
									equipments[i].name = text;
									this.setState({ equipments });
								}}
								value={this.state.equipments[i].name} /> 
							</Item>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>個数</Label>
								<Input onChangeText={(text) => {
									let equipments = this.state.equipments.concat();
									equipments[i].number = Number(text);
									this.setState({ equipments });
								}} 
								selectTextOnFocus
								keyboardType="numeric"
								value={String(this.state.equipments[i].number)} />
							</Item>
						</Body>
						<Button
							transparent
							onPress={() => {
								const deleted = this.state.equipments.concat();
								deleted.splice(i, 1);
								this.setState({ equipments: deleted });
							}}
						>
							<Icon name="close" />
						</Button>
					</ListItem>
				);
			});
			return render;
		};
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
						} />
					</Left>
					<Body>
						<Title>新しいロケーション</Title>
					</Body>
				</Header>
				<Content>
					<Form style={{ marginVertical: '10%', marginHorizontal: '5%' }}>
						<List>
							<Item floatingLabel style={{ marginBottom: '2%' }}>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>名称</Label>
								<Input
									onChangeText={(text) => this.setState({ name: text })} value={this.state.name} />
							</Item>
							<Button onPress={() => {
								this.setState({ equipments: [...this.state.equipments, {name: '', number: '0'}] });
							}}>
								<Text>備品を追加</Text>
							</Button>
							{equipments()}
						</List>
					</Form>
				</Content>
				<Fab
					containerStyle={{}}
					style={{ backgroundColor: '#5067FF' }}
					position="bottomRight"
					onPress={() => this.createNewLocation()}
				>
					<Icon name="add" />
				</Fab>
			</Container>
		);
	}
}