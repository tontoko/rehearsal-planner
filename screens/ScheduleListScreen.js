import React from 'react';
import { StatusBar, ListView } from 'react-native';
import { Content, Header, Left, Right, Icon, Container, Button, Body, Title, Text, List, Separator, ListItem, Fab, View } from 'native-base';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import moment from 'moment';

class ScheduleListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}
	deleteRow(data, secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].props.closeRow();
		this.props.deleteSchedule(data.id);
	}
	render() {
		return (
			<Container style={{ paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0 }}>
				<Header>
					<Left>
						<Icon name="menu" onPress={() => {this.props.navigation.openDrawer();}
						} />
					</Left>
					<Body>
						<Title>スケジュール</Title>
					</Body>
				</Header>
				<View style={{ flex: 1 }}>
					<Content>
						<List
							leftOpenValue={75}
							rightOpenValue={-75}
							dataSource={this.ds.cloneWithRows(this.props.schedules.schedules)}
							renderRow={data =>
								<ListItem onPress={() => this.props.navigation.navigate('ScheduleEditScreen', {id: data.id,})}>
									<Body>
										<Text>{data.id}</Text>
										<Text note>{data.location}</Text>
									</Body>
									<Right>
										<Text note>{moment(data.date).calendar()}</Text>
									</Right>              
								</ListItem>}
							renderLeftHiddenRow={data =>
								<Button full onPress={() => alert(data.title)}>
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
						onPress={() => this.props.navigation.navigate('ScheduleCreateScreen')}
					>
						<Icon name="create" />
					</Fab>
				</View>
			</Container>
		);
	}
}


const mapStateToProps = (state) => {
	return state;
};
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(Actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleListScreen);