import React from 'react';
import { StatusBar, ListView, Dimensions } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab, Thumbnail } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db, currentUser;

export default class ProjectCreateScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
            selected: [],
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
		};
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
        db.settings(settings);
        this.onLayout = this.onLayout.bind(this);

		// currentUser取得
		currentUser = firebase.auth().currentUser;
	}
    
	componentDidMount() {
		const willFocusSub = this.props.navigation.addListener(
			'willFocus',
			payload => {
				if (this.props.navigation.getParam('type') == 'selected') {
					const selected = this.props.navigation.getParam('selected', []);
					this.setState({ selected });
				} else if (this.props.navigation.getParam('type') == 'newUser') {
					this.setState({ selected: [...this.state.selected, this.props.navigation.getParam('newContact', '')] });
				}
			}
		);
	}

	createNewProject() {
		if (this.state.name) {
			this.addProject(this.state.name);
		} else {
			alert('必須項目が入力されていません');
		}
	}
    
	async addProject(name) {
        let list = {};
        let participants = [{ name: currentUser.displayName, email: currentUser.email, image: currentUser.photoURL }, ...this.state.selected];
        await Promise.all(this.state.selected.map(async user => {
            list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
        }));
		db.collection('projects').add({
			name,
            [this.replaceAll(currentUser.email, '.', '%2E')]: true,
            participants,
            ...list,
		})
			.then(() => {
				this.props.navigation.goBack();
			})
			.catch((error) => {
				alert(error);
			});
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
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
    
    onLayout() {
        // 端末回転時
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
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
						<Title>新しいプロジェクト</Title>
					</Body>
				</Header>
				<Content>
                    <Form style={{ 
                        marginVertical: this.state.height >= this.state.width ? '10%' : '3%',
                        marginHorizontal: '5%' 
                    }}>
						<List>
							<Item floatingLabel>
								<Label style={{ paddingTop: '1%', fontSize: 14 }}>プロジェクト名</Label>
								<Input onChangeText={text => this.setState({ name: text })} value={this.state.name} />
							</Item>
                            <ListItem itemHeader style={{ 
                                flex: 1, 
                                justifyContent: 'space-around', 
                                marginBottom: this.state.height >= this.state.width ? '3%' : '1%', 
                                marginTop: this.state.height >= this.state.width ? '5%' : '1%', 
                            }}>
								<Button onPress={() => this.props.navigation.navigate('ContactCreateScreen', { navigateTo: 'ProjectCreateScreen' })}>
									<Text>連絡先を追加</Text>
								</Button>
								<Text>or</Text>
								<Button onPress={() => this.props.navigation.navigate('AdressListScreen', { selected: this.state.selected, navigateTo: 'ProjectCreateScreen' })}>
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
					onPress={() => this.createNewProject()}
				>
					<Icon name="add" />
				</Fab>
			</Container>
		);
	}
}