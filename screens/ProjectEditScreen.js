import React from 'react';
import { StatusBar, ListView, Dimensions } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab, Thumbnail } from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import * as firebase from 'firebase';

let db, currentUser;

export default class ProjectEditScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            name: this.props.navigation.getParam('project', '').name,
            selected: [],
            participants: this.props.navigation.getParam('project', '').participants,
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

	async editProject() {
        const participants = [...this.state.participants, ...this.state.selected];
        // データベース検索用のidリスト
        let list = {};
        await Promise.all(participants.map(async user => {
            list = { ...list, [this.replaceAll(user.email, '.', '%2E')]: true };
        }));
		if (this.state.name) {
			db.collection('projects').doc(this.props.navigation.getParam('project', '').id).update({
                name: this.state.name,
                participants,
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
    
    onLayout() {
        // 端末回転時
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
    }

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

	render() {
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }} />
					</Left>
					<Body>
						<Title>{this.state.name}</Title>
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
                                <Button onPress={() => this.props.navigation.navigate('ContactCreateScreen', { navigateTo: 'ProjectEditScreen' })}>
                                    <Text>連絡先を追加</Text>
                                </Button>
                                <Text>or</Text>
                                <Button onPress={() => this.props.navigation.navigate('AdressListScreen', { participants: this.state.participants, selected: this.state.selected, navigateTo: 'ProjectEditScreen' })}>
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
					onPress={() => this.editProject()}
				>
					<Icon name="add" />
				</Fab>
			</Container>
		);
	}
}