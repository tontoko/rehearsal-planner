import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View } from 'native-base';
import LoadingScreen from './LoadingScreen'
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

	componentWillMount() {
		db.collection('schedules').where(this.replaceAll(currentUser.email, '.', '%2E'), '==', true)
			.onSnapshot((snapShot) => {
				let schedules = [];
				snapShot.forEach(doc => {
					const docData = doc.data();
					schedules.push({ ...docData, id: doc.id });
				});
				this.setState({ schedules, loading: false });
			});
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	deleteRow(data, secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].props.closeRow();
		db.collection('schedules').doc(data.id)
			.delete()
			.catch(error => {
				alert(error);
			});
	}

	render() {
		if (this.state.loading) {
			return (<LoadingScreen />);
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