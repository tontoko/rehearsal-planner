import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { View, ListItem, List, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input, Spinner, Thumbnail, Fab } from 'native-base';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';

export default class AdressListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listData: [],
			loading: true,
			users: null,
			selected: [],
			toScreen: '',
		};
	}

	async componentWillMount() {
		// ユーザーと選択済みリストを取得
		const users = this.props.navigation.getParam('users', []);
		const selected = this.props.navigation.getParam('selected', []);
		const type = this.props.navigation.getParam('type', '');
		this.setState({users: users.length})
		this.setState({ selected }); 
		this.setState({ toScreen: type == 'create' ? 'ScheduleCreateScreen' : 'ScheduleEditScreen' })

		const db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
		await users.forEach(user => {
			db.collection('users').doc(user)
				.get().then(doc => {
					const docData = doc.data();
					this.setState({listData: [...this.state.listData, docData]})
				})
				.catch(error => alert(error));
		});
		this.setState({loading: false});
	}

	ifChecked(filterId) {
		const filtered = this.state.selected.filter(n => n.id == filterId);
		if (filtered.length == 0) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		if (!this.state.loading && this.state.listData.length == this.state.users) {
			let list = [];
			this.state.listData.forEach(e => {
				list.push((
					<ListItem thumbnail key={e.id}>
						<Left>
							<Thumbnail square source={{ uri: e.image }} />
						</Left>
						<Body>
							<Text>{e.name}</Text>
							<Text note numberOfLines={1}>{e.email}</Text>
						</Body>
						<Right>
							<CheckBox 
								onPress={() => {
									if (!this.ifChecked(e.id)) {
										const added = [...this.state.selected, e];
										this.setState({ selected: added });
									} else {
										const deleted = this.state.selected.filter(n => n.id !== e.id);
										this.setState({ selected: deleted });
									}
								}}
								checked={this.ifChecked(e.id)}
							/>
						</Right>
					</ListItem>
				));
			});
			return (
				<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
					<Header>
						<Left>
							<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
							} />
						</Left>
						<Body>
							<Title>アドレス帳</Title>
						</Body>
					</Header>
					<Content>
						<List>
							{list}
						</List>
					</Content>
					<Fab
						containerStyle={{}}
						style={{ backgroundColor: '#5067FF' }}
						position="bottomRight"
						onPress={() => this.props.navigation.navigate(this.state.toScreen, { selected: this.state.selected, type: 'selected' })}
					>
						<Icon name="add" />
					</Fab>
				</Container>
			);
		} else {
			return (
				<Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Spinner />
				</Container>
			);
		}
		
	}
}