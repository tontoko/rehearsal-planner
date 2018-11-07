import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db, currentUser;

export default class ScheduleListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			schedules: [],
			loading: true,
		};
		currentUser = firebase.auth().currentUser;
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	componentDidMount() {
		this.unsubscribe = db.collection('schedules').where(this.replaceAll(currentUser.email, '.', '%2E'), '==', true)
			.onSnapshot((snapShot) => {
				if (snapShot.empty) {
					this.setState({ loading: false });
				} else {
					this.setState({ schedules: [], loading: true });
					snapShot.docs.forEach((doc, i) => {
						const docData = doc.data();
						if (snapShot.docs.length <= i+1) {
							this.setState({ schedules: [...this.state.schedules, { ...docData, id: doc.id }], loading: false });
						} else {
							this.setState({ schedules: [...this.state.schedules, { ...docData, id: doc.id }] });
						}
					});
				}
			});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	async deleteRow(data, secId, rowId, rowMap) {
		Alert.alert('確認', '本当に削除しますか？', [{ text: 'はい', onPress: () => {  
			db.collection('schedules').doc(data.id)
				.delete()
				.then(async () => {
					const schedules = await this.state.schedules.filter(e => e.id !== data.id);
					this.setState({ schedules });
				})
				.catch(error => {
					alert(error);
				});
		} }, { text: 'キャンセル' }]) 
	}

	render() {
		if (this.state.loading) {
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="menu" onPress={() => { this.props.navigation.openDrawer(); }
							} />
						</Left>
						<Body>
							<Title>スケジュール</Title>
						</Body>
					</Header>
					<LoadingScreen />
				</Container>
			);
		} else {
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="menu" onPress={() => {this.props.navigation.openDrawer();}
							} />
						</Left>
						<Body>
							<Title>スケジュール</Title>
						</Body>
					</Header>
					<View style={{ flex: 1 }}>
						<Content>
							<List
								leftOpenValue={75}
								rightOpenValue={-75}
								dataSource={this.ds.cloneWithRows(this.state.schedules)}
								renderRow={data =>
									<ListItem onPress={() => this.props.navigation.navigate(
										'ScheduleEditScreen', 
										{
											id: data.id, 
											title: data.title, 
											location: data.location, 
											date: data.date, 
											participants: data.participants,
											type: 'edit',
											projectName: data.projectName,
										}
									)}>
										<Body>
											<Text>{data.title}</Text>
											<Text note>{data.location}</Text>
										</Body>
										<Right>
											<Text note>{moment(data.date).calendar()}</Text>
										</Right>              
									</ListItem>}
								renderLeftHiddenRow={data =>
									<Button full onPress={() => {
										let participants;
										data.participants.forEach((e, i) => {
											if (i == 0) {
												participants = e.name;
											} else {
												participants += '\n' + e.name;
											}
										});
										Alert.alert('参加者一覧', participants);
									}}>
										<Icon active name="information-circle" />
									</Button>}
								renderRightHiddenRow={(data, secId, rowId, rowMap) =>
									<Button full danger onPress={_ => this.deleteRow(data, secId, rowId, rowMap)}>
										<Icon active name="trash" />
									</Button>}
							/>
						</Content>
						<Fab
							containerStyle={{}}
							style={{ backgroundColor: '#5067FF' }}
							position="bottomRight"
							onPress={() => this.props.navigation.navigate('ScheduleCreateScreen')}
						>
							<Icon name="create" />
						</Fab>
					</View>
				</Container>
			);
		}
	}
}