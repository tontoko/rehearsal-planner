import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import {Header, Left, Right, Icon, Container, Button, Body, Title, Text} from 'native-base';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Container style={{ paddingTop: 27 }}>
          <Header>
            <Left>
            <Icon name="menu" onPress={() => 
              navigation.openDrawer()
            }/>
            </Left>
            <Body>
              <Title>HomeScreen</Title>
            </Body>
          </Header>
        </Container>
      ),
    };
  };

  render() {

    return (
      <Container style={{ paddingTop: 27 }}>
      <Body>
        <Button success onPress={() => this.props.navigation.navigate('Test')}><Text> go to test </Text></Button>
      </Body>
      </Container>
    );
  }
}
