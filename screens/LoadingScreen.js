import React from 'react';
import { View, ListItem, Content, Form, Header, Left, Right, Icon, Container, Button, Body, Title, Text, CheckBox, Item, Imput, Label, Input, Spinner } from 'native-base';

export default class LoadingScreen extends React.Component {
	render() {
		return (
			<Container style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</Container>
		);
	}
}