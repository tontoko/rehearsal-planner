import React from 'react';
import { StatusBar, ListView, Dimensions } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab, Thumbnail, Subtitle, Picker } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class ScheduleEditScreen extends React.Component {
	constructor (props) {
		super(props);
		const { id, title, location, date, participants } = props.navigation.state.params;

		this.state = {
			title,
			location,
			participants,
			date,
			id,
			ifLoaded: false,
			project: this.props.navigation.getParam('project', null),
			projectName: this.props.navigation.getParam('projectName', null),
			selected: [],
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		};
		this.onLayout = this.onLayout.bind(this);
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
		this.locations = [(<Picker.Item label="指定なし" value="null" key="0" />)];
		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}

	componentDidMount() {
		const willFocusSub = this.props.navigation.addListener(
			'willFocus',
			payload => {
				if (this.props.navigation.state.params.type == 'selected') {
					const selected = this.props.navigation.getParam('selected', []);
					this.setState({ selected });
				} else if (this.props.navigation.getParam('type') == 'newUser') {
					this.setState({ selected: [...this.state.selected, this.props.navigation.getParam('newContact', '')] })
				}
			}
		);
		db.collection('users').doc(currentUser.uid).collection('locations')
			.get()
			.then((snapShot) => {
				snapShot.docs.forEach((e, i) => {
					const data = e.data();
					if (snapShot.docs.length <= i + 1) {
						this.locations = [...this.locations, (<Picker.Item label={data.name} value={data} key={i++} />)];
						this.setState({ ifLoaded: true });
					} else {
						this.locations = [...this.locations, (<Picker.Item label={data.name} value={data} key={i++} />)];
					}
				})
			})
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	async editSchedule() {
		if (this.state.title && this.state.location && this.state.date) {
			const participants = [ ...this.state.participants, ...this.state.selected ];
			// データベース検索用のidリスト
			let list = {};
			await Promise.all(participants.map(async user => {
				list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
			}));
			db.collection('schedules').doc(this.state.id).update({
				title: this.state.title,
				location: this.state.location,
				participants,
				date: this.state.date,
				...list,
			})
				.then(() => {
					this.props.navigation.goBack();
				});
		} else {
			alert('必須項目が入力されていません');
		}
	}

	onLayout() {
		// 端末回転時
		this.setState({
			width: Dimensions.get('window').width,
			height: Dimensions.get('window').height,
		});
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

	renderSelectedUser() {
		let list = [];
		this.state.participants.forEach((e, i) => {
			list.push(
				(
					<ListItem key={i} avatar>
						<Left>
							<Thumbnail small source={{ uri: e.image ? e.image : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3' }} />
						</Left>
						<Body>
							<Text>{e.name}</Text>
						</Body>
					</ListItem>
				)
			);
		});
		this.state.selected.forEach((e, i) => {
			list.push(
				(
					<ListItem key={i + 's'} avatar>
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
				)
			);
		});
		return list;
	}

	onValueChange(value: string) {
		this.setState({
			location: value
		});
	}

	render() {
		const projectName = () => {
			if (this.state.project) {
				return 'プロジェクト: ' + this.state.project.name
			} else if (this.state.projectName) {
				return 'プロジェクト: ' + this.state.projectName
			} else {
				return ''
			}
		}
		return (
			<Container onLayout={this.onLayout} style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
						} />
					</Left>
					<Body>
						<Title>{this.state.title}</Title>
						<Subtitle>{projectName()}</Subtitle>
					</Body>
				</Header>
				<Content>
					<Form style={{
						marginVertical: this.state.height >= this.state.width ? '10%' : '5%',
						marginHorizontal: '5%'
					}}>
						<List>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>予定名</Label>
								<Input onChangeText={(text) => this.setState({ title: text })} value={this.state.title} />
							</Item>
							<Item>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>会場</Label>
								<Picker
									mode="dropdown"
									style={{ width: 120 }}
									selectedValue={this.state.location}
									onValueChange={this.onValueChange.bind(this)}
									enabled={this.state.ifLoaded}
								>
									{this.locations}
								</Picker>
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
								<Button onPress={() => this.props.navigation.navigate('ContactCreateScreen', { navigateTo: 'ScheduleEditScreen' })}>
									<Text>連絡先を追加</Text>
								</Button>
								<Text>or</Text>
								<Button onPress={() => this.props.navigation.navigate('AdressListScreen', { participants: this.state.participants, selected: this.state.selected, navigateTo: 'ScheduleEditScreen' })}>
									<Text>アドレス帳</Text>
								</Button>
							</ListItem>
							{this.renderSelectedUser()}
						</List>
					</Form>
				</Content>
				<Fab
					containerStyle={{}}
					style={{ backgroundColor: '#5067FF' }}
					position="bottomRight"
					onPress={() => this.editSchedule()}
				>
					<Icon name="checkmark" />
				</Fab>
			</Container>
		);
	}
}