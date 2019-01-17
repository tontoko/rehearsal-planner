import React from 'react';
import { StatusBar, ListView, Alert } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View, Subtitle } from 'native-base';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';
import * as firebase from 'firebase';

let db, currentUser;

export default class ProjectScheduleListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            schedules: [],
            loading: true,
            project: this.props.navigation.getParam('project'),
        };
        currentUser = firebase.auth().currentUser;
        db = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        db.settings(settings);
    }

    componentDidMount() {
        this.unsubscribe = db.collection('schedules').where(this.state.project.id, '==', true)
            .onSnapshot((snapShot) => {
                if (snapShot.empty) {
                    this.setState({ loading: false });
                } else {
                    this.setState({ schedules: [], loading: true });
                    snapShot.docs.forEach((doc, i) => {
                        const docData = doc.data();
                        if (snapShot.docs.length <= i + 1) {
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
        Alert.alert('確認', '本当に削除しますか？', [{
            text: 'はい', onPress: () => {
                this.setState({ loading: true });
                db.collection('schedules').doc(data.id)
                    .delete()
                    .then(async () => {
                        const schedules = await this.state.schedules.filter(e => e.id !== data.id);
                        this.setState({ schedules, loading: false });
                    })
                    .catch(error => {
                        alert(error);
                        this.setState({ loading: false });
                    });
            }
        }, { text: 'キャンセル' }])
    }

    render() {
        if (this.state.loading) {
            return (
                <Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
                    <Header>
                        <Left>
                            <Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
                            } />
                        </Left>
                        <Body>
                            <Title>スケジュール</Title>
                            <Subtitle>プロジェクト: {this.state.project ? this.state.project.name : ''}</Subtitle>          
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
                            <Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
                            } />
                        </Left>
                        <Body>
                            <Title>スケジュール</Title>
                            <Subtitle>{this.state.project ? 'プロジェクト: ' + this.state.project.name : ''}</Subtitle>                       
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
                                            project: this.state.project,
                                            type: 'edit',
                                        }
                                    )}>
                                        <Body>
                                            <Text>{data.title}</Text>
                                            <Text note>{data.location.name ? data.location.name : ''}</Text>
                                        </Body>
                                        <Right>
                                            <Text note>{moment(data.date).calendar()}</Text>
                                        </Right>
                                    </ListItem>}
                                renderLeftHiddenRow={data =>
                                    <Button full onPress={async () => {
                                        let participants, equipments;
                                        await Promise.all(
                                            data.participants.map(async (e, i) => {
                                                if (i == 0) {
                                                    participants = e.name;
                                                } else {
                                                    participants += '\n' + e.name;
                                                }
                                            })
                                        );
                                        if (data.location.equipments) {
                                            await Promise.all(
                                                data.location.equipments.map(async (e, i) => {
                                                    const { name, number } = e
                                                    if (i == 0) {
                                                        equipments = '備品\n' + name + ': ' + number;
                                                    } else {
                                                        equipments += '\n' + name + ': ' + number;
                                                    }
                                                })
                                            );
                                            Alert.alert('参加者一覧', participants + '\n\n' + equipments);
                                        } else {
                                            Alert.alert('参加者一覧', participants);
                                        }
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
                            onPress={() => this.props.navigation.navigate('ScheduleCreateScreen', {project: this.state.project})}
                        >
                            <Icon name="create" />
                        </Fab>
                    </View>
                </Container>
            );
        }
    }
}