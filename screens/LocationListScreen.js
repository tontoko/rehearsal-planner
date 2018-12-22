import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Thumbnail } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class LocationListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			locations: [],
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
        this.unsubscribe = db.collection('users').doc(currentUser.uid).collection('locations')
			.onSnapshot((snapShot) => {
				this.setState({ locations: [], loading: true });
				if (snapShot.empty) {
                    this.setState({ loading: false });
				} else {
					snapShot.docs.forEach((doc, i) => {
						if (snapShot.docs.length <= i + 1) {
                            this.setState({ locations: [...this.state.locations, { name: doc.data().name, equipments: doc.data().equipments, id: doc.id, }], loading: false, });
						} else {
                            this.setState({ locations: [...this.state.locations, { name: doc.data().name, equipments: doc.data().equipments, id: doc.id, }] });
						}
					});
				}
            });
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	deleteRow(data, secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].props.closeRow();
		db.collection('locations').doc(data.id)
			.delete()
			.then(() => {
				const locations = this.state.locations.filter(e => e.id !== data.id);
				this.setState({ locations });
			})
			.catch(error => {
				alert(error);
			});
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
							<Title>ロケーション</Title>
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
                            <Title>ロケーション</Title>
						</Body>
					</Header>
					<View style={{ flex: 1 }}>
						<Content>
							<List
								leftOpenValue={75}
								rightOpenValue={-75}
								dataSource={this.ds.cloneWithRows(this.state.locations)}
								renderRow={data =>
									<ListItem onPress={() => this.props.navigation.navigate('LocationEditScreen', {data})}>
										<Body>
											<Text>{data.name}</Text>
										</Body>
									</ListItem>}
								renderLeftHiddenRow={data =>
									<Button full onPress={() => {
										let msg = '';
										data.equipments.forEach((e) => {
											msg = msg + e.name + '(' + e.number + ') ';
										});
										alert(msg);
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
							onPress={() => this.props.navigation.navigate('LocationCreateScreen')}
						>
							<Icon name="create" />
						</Fab>
					</View>
				</Container>
			);
		}
	}
} 