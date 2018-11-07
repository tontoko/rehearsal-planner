import React from 'react';
import { StatusBar, ListView, Dimensions } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab, Thumbnail, Subtitle } from 'native-base';
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
			date: null,
			selected: [],
			project: this.props.navigation.getParam('project', null),
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);

		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}

	componentDidMount() {
		const willFocusSub = this.props.navigation.addListener(
			'willFocus',
			payload => {
				if (this.props.navigation.getParam('type') == 'selected') {
					const selected = this.props.navigation.getParam('selected', []);
					this.setState({selected});
				} else if (this.props.navigation.getParam('type') == 'newUser') {
					this.setState({selected: [...this.state.selected, this.props.navigation.getParam('newContact', '')]})
				}
			}
		);
	}

	async createNewSchedule() {
		if (this.state.title && this.state.location && this.state.date) {
			let participants = [{ name: currentUser.displayName, email: currentUser.email, image: currentUser.photoURL }, ...this.state.selected ];
			// データベース検索用のidリスト
			let list = {};
			await Promise.all(participants.map(async user => {
				list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
			}));
			if (this.state.project) {
				db.collection('schedules').add({
					title: this.state.title,
					location: this.state.location,
					participants,
					date: this.state.date,
					[this.state.project.id]: true,
					projectName: this.state.project.name,
					...list,
				})
					.then(() => {
						this.props.navigation.goBack();
					})
					.catch((error) => {
						alert(error);
					});
			} else {
				db.collection('schedules').add({
					title: this.state.title,
					location: this.state.location,
					participants,
					date: this.state.date,
					projectName: '',
					...list,
				})
				.then(() => {
					this.props.navigation.goBack();
				})
					.catch((error) => {
						alert(error);
					});
				}
			} else {
			alert('必須項目が入力されていません');
		}
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}
    
	// newUser() {
	// 	let newUser = [];
	// 	for (let index = 0; index < this.state.newUser.length; index++) {
	// 		newUser.push((
	// 			<ListItem key={index}>
	// 				<Body>
	// 					<Item floatingLabel>
	// 						<Label style={{ paddingTop: '1%', fontSize: 14 }}>名前</Label>
	// 						<Input 
	// 							onChangeText={(text) => {
	// 								let newUser = this.state.newUser;
	// 								newUser[index].name = text;
	// 								this.setState({ newUser });
	// 							}}
	// 							value={this.state.newUser[index].name} />
	// 					</Item>
	// 					<Item floatingLabel>
	// 						<Label style={{ paddingTop: '1%', fontSize: 14 }}>メールアドレス</Label>
	// 						<Input 
	// 							keyboardType="email-address"
	// 							autoCorrect={false}
	// 							autoCapitalize="none" 
	// 							onChangeText={(text) => {
	// 								let newUser = this.state.newUser;
	// 								newUser[index].email = text;
	// 								this.setState({ newUser });
	// 							}}
	// 							value={this.state.newUser[index].email} />
	// 					</Item>
	// 				</Body>
	// 				<Button
	// 					onPress={() => {
	// 						const newUser = this.state.newUser.filter((n, i) => i !== index);
	// 						this.setState({ newUser });
	// 					}}
	// 					transparent
	// 				>
	// 					<Icon name="close" />
	// 				</Button>
	// 			</ListItem>
	// 		));
	// 	}
	// 	return newUser;
	// }

	onLayout() {
		// 端末回転時
		this.setState({
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		});
	}
    
	renderSelectedUser() {
		let list = [];
		this.state.selected.forEach((e, i) => {
			list.push(
				<ListItem key={i} avatar>
					<Left>
						<Thumbnail small source={{ uri: e.image ? e.image : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3' }} />
					</Left>
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
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
						} />
					</Left>
					<Body>
						<Title>新しいスケジュール</Title>
						<Subtitle>{this.state.project ? 'プロジェクト: ' + this.state.project.name : ''}</Subtitle>
					</Body>
				</Header>
				<Content>
					<Form style={{ marginVertical: this.state.height >= this.state.width ? '10%' : '5%',
						marginHorizontal: '5%' }}>
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
							<ListItem itemHeader style={{ flex: 1, justifyContent: 'space-around', marginHorizontal: '3%' }}>
								<Button onPress={() => this.props.navigation.navigate('ContactCreateScreen', { navigateTo: 'ScheduleCreateScreen' })}>
									<Text>連絡先を追加</Text>
								</Button>
								<Text>or</Text>
								<Button onPress={() => this.props.navigation.navigate('AdressListScreen', { selected: this.state.selected, navigateTo: 'ScheduleCreateScreen'})}>
									<Text>アドレス帳</Text>
								</Button>
							</ListItem>
							<ListItem avatar>
								<Left>
									<Thumbnail small source={{ uri: currentUser.photoURL ? currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3' }} />
								</Left>
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