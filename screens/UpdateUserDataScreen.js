import React from 'react';
import { StatusBar, ListView, Alert, CameraRoll } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Thumbnail, Form, Item, Label, Input } from 'native-base';
import { ImagePicker, Permissions } from 'expo';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db;
let currentUser;

export default class UpdateUserDataScreen extends React.Component {
	constructor(props) {
		super(props);
		currentUser = firebase.auth().currentUser;
		this.state = {
			photo: currentUser.photoURL ? currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/rehearsalplanner-f7b28.appspot.com/o/%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=70a6f7fd-a9b0-4790-a4a8-58c3d94823c3',
            password1: '',
            password2: '',
            password3: '',
            permission: null,
            uploading: false,
		};
		db = firebase.firestore();
		const settings = { timestampsInSnapshots: true };
		db.settings(settings);
	}

	replaceAll(str, before, after) {
		return str.split(before).join(after);
	}
    
	async getImage() {
        if (this.state.permission === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync();
            this.setState({ photo: result.uri });
        } else {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                this.setState({ permission: 'granted' })
                let result = await ImagePicker.launchImageLibraryAsync();
                this.setState({ photo: result.uri });
            }
        }
    }
    
    async updatePhoto() {
        this.setState({ uploading: true });
        const response = await fetch(this.state.photo);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child(currentUser.uid);
        await ref.put(blob)
        .then((snapShot) => {
            firebase.storage().ref().child(currentUser.uid).getDownloadURL().then((url) => {
                currentUser.updateProfile({
                    photoURL: url,
                }).then(() => {
                    db.collection('users').doc(currentUser.uid).update({
                        image: url,
                    }).then(() => {
                        alert('更新しました！')
                        this.setState({ uploading: false });
                    })
                })
            })
        })
        .catch((err) => {
            alert('エラーが発生しました');
            this.setState({ uploading: false });
        })
    }

    async updatePassword() {
        if(this.state.password2 === this.state.password3) {
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                this.state.password1
            );
            currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
                currentUser.updatePassword(this.state.password2).then(() => {
                    alert('更新しました！')
                });
            }).catch((err) => {
                alert('エラーが発生しました');
            });
        } else {
            alert('パスワードが一致しません');
        }
    }

	render() {
        if (this.state.uploading) {
            return (<LoadingScreen />)
        } else {
            return (
                <Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
                    <Header>
                        <Left>
                            <Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
                            } />
                        </Left>
                        <Body>
                            <Title>登録情報の変更</Title>
                        </Body>
                    </Header>
                    <Content>
                        <View style={{ alignItems: 'center', marginTop: '5%' }}>
                            <Thumbnail large source={{
                                uri: this.state.photo,
                            }} />
                            <View style={{ marginTop: '5%' }}>
                                <Button onPress={() =>
                                    this.getImage()
                                }>
                                    <Text>カメラロールから選択</Text>
                                </Button>
                            </View>
                            <View style={{ marginTop: '4%' }}>
                                <Button onPress={() => 
                                    this.updatePhoto()
                                }>
                                    <Text>プロフィール画像をアップロード</Text>
                                </Button>
                            </View>
                            <Form style={{ marginTop: '5%', width: '70%' }}>
                                <List>
                                    <Item floatingLabel>
                                        <Label style={{ paddingTop: '1%', fontSize: 14 }}>現在のパスワード</Label>
                                        <Input secureTextEntry onChangeText={(text) => this.setState({ password1: text })} value={this.state.password1} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label style={{ paddingTop: '1%', fontSize: 14 }}>新しいパスワード</Label>
                                        <Input secureTextEntry onChangeText={(text) => this.setState({ password2: text })} value={this.state.password2} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label style={{ paddingTop: '1%', fontSize: 14 }}>再度入力</Label>
                                        <Input secureTextEntry onChangeText={(text) => this.setState({ password3: text })} value={this.state.password3} />
                                    </Item>
                                </List>
                                <View style={{ marginTop: '5%', alignSelf: 'flex-end' }}>
                                    <Button onPress={() =>
                                        this.updatePassword()
                                    }>
                                        <Text>パスワードを更新</Text>
                                    </Button>
                                </View>
                            </Form>
                        </View>
                    </Content>
                </Container>
            );
        }
	}

}