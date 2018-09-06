import React from 'react';
import { StatusBar, ListView } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View } from 'native-base';
import moment from 'moment';
import * as firebase from 'firebase';

export default class ScheduleListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			schedules: [],
		};
		this.currentUser = firebase.auth().currentUser;
		this.db = firebase.firestore();
		this.settings = { timestampsInSnapshots: true };
		this.db.settings(this.settings);
	}

	componentWillMount() {
		this.db.collection(`users/${this.currentUser.uid}/schedules`)
			.onSnapshot((snapShot) => {
				let schedules = [];
				snapShot.forEach((doc) => {
					const docData = doc.data();
					schedules.push({ ...docData, id: doc.id });
				});
				this.setState({ schedules });
			});
	}

	deleteRow(data, secId, rowId, rowMap) {
		this.db.collection(`users/${this.currentUser.uid}/schedules`).doc(data.id)
			.delete()
			.then(() => rowMap[`${secId}${rowId}`].props.closeRow())
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
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
										participants: data.participants
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
								<Button full onPress={() => alert(data.participants[0].name)}>
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