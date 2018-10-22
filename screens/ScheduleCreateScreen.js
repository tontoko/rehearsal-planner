import React from 'react';
import { StatusBar, ListView } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';
import { __await } from 'tslib';

let db;
let currentUser;

export default class ScheduleCreateScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			location: '',
			addName: '',
			date: null,
			newUser: [],
			contacts: [],
			selected: [],
		};
	}

	componentWillMount() {
		const willFocusSub = this.props.navigation.addListener(
			'willFocus',
			payload => {
				if (this.props.navigation.getParam('type') == 'selected') {
					const selected = this.props.navigation.getParam('selected', []);
					this.setState({selected});
				}
			}
		);

		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;

		// アドレス帳リスト取得
		db.collection('contacts').where(currentUser.uid, '==', true)
			.get()
			.then((snapShot) => {
				snapShot.forEach((doc) => {
					const docData = doc.data();
					Object.keys(docData).forEach((userId) => {
						if (userId !== this.currentUser.uid) {
							this.db.collection('users').doc(userId)
								.get()
								.then((userDoc) => {
									this.setState({ contacts: [...this.state.contacts, userDoc.data()] });
								});
						}
					});
				});
			});
	}

	async createNewSchedule() {
		let checkNewUser = 0;
		await this.state.newUser.forEach(async e => {
			if (!e.email || !e.name) { 
				checkNewUser ++; 
			} else if (!e.email.match(/.+@.+\..+/)) {
				alert('メールアドレスの形式が正しくありません');
				return false;
			}
		})
		if (this.state.title && this.state.location && this.state.date && checkNewUser == 0) {
			let participants = [{ id: currentUser.uid, name: currentUser.displayName, email: currentUser.email }, ...this.state.selected, ...this.state.newUser];
			// データベース検索用のidリスト
			let list = {};
			await Promise.all(participants.map(async (user, i) => {
				if (!user.id) {
					await db.collection('users').add({
						name: user.name,
						email: user.email,
					})
					.then(newUser => {
						list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
						participants[i].id = newUser.id;
						db.collection('users').doc(newUser.id).update({
							id: newUser.id,
						})
					})
				} else {
					list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
				}
			}));
			db.collection('schedules').add({
				title: this.state.title,
				location: this.state.location,
				participants,
				date: this.state.date,
				...list,
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

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}
    
	newUser() {
		let newUser = [];
		for (let index = 0; index < this.state.newUser.length; index++) {
			newUser.push((
				<ListItem key={index}>
					<Body>
						<Item floatingLabel>
							<Label style={{ paddingTop: '1%', fontSize: 14 }}>名前</Label>
							<Input 
								onChangeText={(text) => {
									let newUser = this.state.newUser;
									newUser[index].name = text;
									this.setState({ newUser });
								}}
								value={this.state.newUser[index].name} />
						</Item>
						<Item floatingLabel>
							<Label style={{ paddingTop: '1%', fontSize: 14 }}>メールアドレス</Label>
							<Input 
								keyboardType="email-address"
								autoCorrect={false}
								autoCapitalize="none" 
								onChangeText={(text) => {
									let newUser = this.state.newUser;
									newUser[index].email = text;
									this.setState({ newUser });
								}}
								value={this.state.newUser[index].email} />
						</Item>
					</Body>
					<Button
						onPress={() => {
							const newUser = this.state.newUser.filter((n, i) => i !== index);
							this.setState({ newUser });
						}}
						transparent
					>
						<Icon name="close" />
					</Button>
				</ListItem>
			));
		}
		return newUser;
	}
    
	renderSelectedUser() {
		let list = [];
		this.state.selected.forEach(e => {
			list.push(
				<ListItem key={e.id}>
					<Body>
						<Text>{e.name}</Text>
					</Body>
					<Button
						transparent
						onPress={() => {
							const deleted = this.state.selected.filter(n => n.email !== e.email);
							this.setState({ selected: deleted });
						}}
					>
						<Icon name="close" />
					</Button>
				</ListItem>
			);
		});
		return list;
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
						<Title>新しいスケジュール</Title>
					</Body>
				</Header>
				<Content>
					<Form style={{ marginVertical: '10%', marginHorizontal: '5%' }}>
						<List>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>予定名</Label>
								<Input onChangeText={(text) => this.setState({ title: text })} value={this.state.title} />
							</Item>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>会場</Label>
								<Input onChangeText={(text) => this.setState({ location: text })} value={this.state.location} />
							</Item>
							<DatePicker
								style={{ width: '100%', marginTop: 20 }}
								date={this.state.date}
								mode="datetime"
								placeholder="日程を選択"
								format="YYYY-MM-DD HH:mm" 
								minDate={moment().format('YYYY-MM-DD HH:mm')}
								maxDate={moment().add(5, 'year').format('YYYY-MM-DD HH:mm')}
								confirmBtnText="決定"
								cancelBtnText="キャンセル"
								customStyles={{
									dateIcon: {
										position: 'absolute',
										left: 0,
										top: 4,
										marginLeft: 0
									},
									dateInput: {
										marginLeft: 36
									}
								}}
								onDateChange={(date) => { this.setState({ date: date }); }}
							/>
							<ListItem itemHeader>
								<Body>
									<Item floatingLabel>
										<Label style={{ paddingTop: '1%', fontSize: 14 }}>参加者を追加</Label>
										<Input onChangeText={(text) => this.setState({ addName: text })} value={this.state.addName} />
									</Item>
									<Button transparent onPress={ () => {
										if (this.state.addName) {
											this.setState({ newUser: [...this.state.newUser, { name: this.state.addName, email: '' }] });
											this.setState({addName: ''});
										}
									}} 
									style={{ position: 'absolute', right: 0, bottom: 0 }}>
										<Icon name="add" />
									</Button>
								</Body>
								<Button onPress={() => this.props.navigation.navigate('AdressListScreen', { users: this.state.contacts, selected: this.state.selected, type: 'create'})}>
									<Text>アドレス帳</Text>
								</Button>
							</ListItem>
							{this.newUser()}
							<ListItem>
								<Body>
									<Text>{currentUser.displayName}</Text>
								</Body>
							</ListItem>
							{this.renderSelectedUser()}
						</List>
					</Form>
				</Content>
				<Fab
					containerStyle={{}}
					style={{ backgroundColor: '#5067FF' }}
					position="bottomRight"
					onPress={() => this.createNewSchedule()}
				>
					<Icon name="add" />
				</Fab>
			</Container>
		);
	}
}