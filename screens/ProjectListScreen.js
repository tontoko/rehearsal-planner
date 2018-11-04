import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Thumbnail } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class ProjectListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			projects: [],
			loading: true,
		};
		currentUser = firebase.auth().currentUser;
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}

	componentDidMount() {
		this.unsubscribe = db.collection('projects').where(this.replaceAll(currentUser.email, '.', '%2E'), '==', true)
			.onSnapshot((snapShot) => {
				this.setState({ projects: [], loading: true });
				if (snapShot.empty) {
					this.setState({ loading: false });
				} else {
					snapShot.docs.forEach((doc, i) => {
						if (snapShot.docs.length <= i + 1) {
							this.setState({ projects: [...this.state.projects, { ...doc.data(), id: doc.id }], loading: false });
						} else {
							this.setState({ projects: [...this.state.projects, { ...doc.data(), id: doc.id }] });
						}
					});
				}
			});
	}
    
	componentWillUnmount() {
		this.unsubscribe();
	}

	deleteRow(data, secId, rowId, rowMap) {
		Alert.alert('確認', '本当に削除しますか？関連するスケジュールもすべて削除されます', [{
			text: 'はい', onPress: () => {  
				rowMap[`${secId}${rowId}`].props.closeRow();
				db.collection('projects').doc(data.id)
					.delete()
					.then(() => {
						const projects = this.state.projects.filter(e => e.id !== data.id);
						this.setState({ projects });
						db.collection('schedules').where(data.id, '==', true)
							.get()
							.then((snapShot) => {
								snapShot.forEach(doc => {
									doc.ref.delete();
								});
							});
					})
					.catch(error => {
						alert(error);
					});
			}
		}, { text: 'キャンセル' }]); 
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
							<Title>プロジェクト</Title>
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
							<Icon name="menu" onPress={() => { this.props.navigation.openDrawer(); }
							} />
						</Left>
						<Body>
							<Title>プロジェクト</Title>
						</Body>
					</Header>
					<View style={{ flex: 1 }}>
						<Content>
							<List
								leftOpenValue={75}
								rightOpenValue={-75}
								dataSource={this.ds.cloneWithRows(this.state.projects)}
								renderRow={data =>
									<ListItem onPress={() => this.props.navigation.navigate('ProjectScheduleListScreen', { project: data })}>
										<Body>
											<Text>{data.name}</Text>
										</Body>
									</ListItem>}
								renderLeftHiddenRow={data =>
									<Button full onPress={() => this.props.navigation.navigate('ProjectEditScreen', { project: data })}>
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
							onPress={() => this.props.navigation.navigate('ProjectCreateScreen')}
						>
							<Icon name="create" />
						</Fab>
					</View>
				</Container>
			);
		}
	}
} 