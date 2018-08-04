import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input } from 'native-base';
import store from '../store';
import { Provider, connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import { StatusBar } from 'react-native';

export const LoginScreen = (props) => {
    console.log(props);
    return (
        <Container style={{ marginTop: StatusBar.currentHeight ? StatusBar.currentHeight: 0 }}>
            <Header />
            <View padder style={{ height: '50%', paddingTop: '30%' }}>
                <Form style={{ flex: 1, justifyContent: 'space-between' }}>
                <Item floatingLabel>
                    <Label>メールアドレス</Label>
                    <Input />
                </Item>
                <Item floatingLabel>
                    <Label>パスワード</Label>
                    <Input password />
                </Item>
                    <ListItem style={{}}>
                        <CheckBox checked={props.props.savePassword.saved} onPress={() => { store.dispatch(Actions.savePassword(!props.props.savePassword.saved)) }} />
                    <Body>
                        <Text style={{fontSize: 14, color: 'gray'}}>パスワードを記憶</Text>
                    </Body>
                </ListItem>
                <Button full style={{marginTop: 30}}><Text>ログイン</Text></Button>
                </Form>
            </View>
        </Container>
    );
}

function mapStateToProps(state) {
    return {props: state}
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)