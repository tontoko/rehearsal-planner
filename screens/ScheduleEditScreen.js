import React from 'react';
import { StatusBar, ListView } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Form, Item, ListItem, Label, View, Input, CheckBox, Fab } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-native-datepicker';
import moment from 'moment'

const id = 1, name = 'なんとかさん1'

class ScheduleEditScreen extends React.Component {
  constructor (props) {
    super(props);
    const id = props.navigation.state.params.id;
    if (!id && id !== 0) {
      alert('エラーが発生しました');
      props.navigation.goBack();
      return false;
    }

    const targetSchedule = props.schedules.schedules.filter(n => n.id == id)[0];

    this.state = {
      title: targetSchedule.title,
      location: targetSchedule.location,
      participants: targetSchedule.participants,
      date: targetSchedule.date,
      id: id,
    }
  }

  ifChecked = (filterId) => {
    const filtered = this.state.participants.filter(n => n.id == filterId);
    if (filtered.length == 0) {
      return false
    } else {
      return true
    }
  }

  editSchedule = () => {
    if (this.state.title && this.state.location && this.state.participants && this.state.date) {
      this.props.editSchedule({
        title: this.state.title,
        location: this.state.location,
        participants: this.state.participants,
        date: this.state.date,
        targetIndex: this.state.id,
      })
      this.props.navigation.navigate('ScheduleListScreen');
    } else {
      alert('必須項目が入力されていません');
    }
  }

  render() {
    return (
      <Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
        <Header>
          <Left>
            <Icon name="arrow-back" onPress={() => { this.props.navigation.goBack(); }
            } />
          </Left>
          <Body>
            <Title>{this.state.title}</Title>
          </Body>
        </Header>
        <Content>
          <Form style={{ flex: 1, justifyContent: 'space-around', marginVertical: '10%', marginHorizontal: '5%' }}>
            <Item floatingLabel>
              <Label style={{ paddingTop: '1%', fontSize: 14 }}>予定名</Label>
              <Input onChangeText={(text) => this.setState({ title: text })} value={this.state.title} />
            </Item>
            <Item floatingLabel>
              <Label style={{ paddingTop: '1%', fontSize: 14 }}>会場</Label>
              <Input onChangeText={(text) => this.setState({ location: text })} value={this.state.location} />
            </Item>
            <DatePicker
              style={{ width: '100%', marginTop: 20 }}
              date={this.state.date}
              mode="datetime"
              placeholder="日程を選択"
              format="YYYY-MM-DD HH:mm"
              minDate={moment().format('YYYY-MM-DD HH:mm')}
              maxDate={moment().add(5, "year").format('YYYY-MM-DD HH:mm')}
              confirmBtnText="決定"
              cancelBtnText="キャンセル"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
            <List style={{ marginTop: '10%' }}>
              <ListItem itemHeader first>
                <Text>参加者</Text>
                <Text>{this.state.participants[0] ? this.state.participants[0].name : ''}</Text>
              </ListItem>
              <ListItem>
                <Body>
                  <Text>なんとかさん1</Text>
                </Body>
                <CheckBox
                  onPress={() => {
                    if (!this.ifChecked(id)) {
                      const added = [...this.state.participants, { id, name }];
                      this.setState({ participants: added });
                    } else {
                      const deleted = this.state.participants.filter(n => n.id !== id);
                      this.setState({ participants: deleted });
                    }
                  }}
                  checked={this.ifChecked(id)}
                />
              </ListItem>
              <ListItem>
                <Body>
                  <Text>ダミー</Text>
                </Body>
                <CheckBox />
              </ListItem>
              <ListItem>
                <Body>
                  <Text>ダミー</Text>
                </Body>
                <CheckBox />
              </ListItem>
            </List>
          </Form>
        </Content>
        <Fab
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => this.editSchedule()}
        >
          <Icon name="checkmark" />
        </Fab>
      </Container>
    );
  }
}


const mapStateToProps = (state) => {
  return state
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleEditScreen)