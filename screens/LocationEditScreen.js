import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class LocationEditScreen extends React.Component {
	constructor(props) {
		super(props);
		const data = this.props.navigation.getParam('data');
		this.state = {
			name: data.name,
			equipments: data.equipments,
			id: data.id,
		};
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}

	async updateLocation() {
		let checkNames = 0;
		await Promise.all(this.state.equipments.map(async equipment => {
			if (!equipment.name) { await checkNames++ }
		}))
		if (this.state.name && checkNames == 0) {
		db.collection('users').doc(currentUser.uid).collection('locations').doc(this.state.id).update({
			equipments: this.state.equipments,
		})
			.then(() => {
				this.props.navigation.goBack();
			})
			.catch((error) => {
				alert(error);
			});
		} else {
			alert('必須項目が入力されていません');
		}
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
						<Title>{this.state.name}</Title>
					</Body>
				</Header>
				<Content>
					<Form style={{ marginVertical: '10%', marginHorizontal: '5%' }}>
						<List>
							<Item style={{ marginBottom: '2%' }}>
								<Text style={{ marginBottom: '2%' }}>{this.state.name}</Text>
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
					onPress={() => this.updateLocation()}
				>
					<Icon name="checkmark" />
				</Fab>
			</Container>
		);
	}
}