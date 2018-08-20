import ScheduleListScreen from '../screens/ScheduleListScreen'; 
import ScheduleCreateScreen from '../screens/ScheduleCreateScreen'; 
import ScheduleEditScreen from '../screens/ScheduleEditScreen';
import { createStackNavigator } from 'react-navigation';
import React from 'react'; 
import { Text } from 'react-native';

export class Test extends React.Component {
    render() {
        console.log(this.props);
        return (
            <Text>Test</Text>
        );
    }
}

export default HomeStackNavigator = createStackNavigator({
    ScheduleListScreen: ScheduleListScreen,
    ScheduleCreateScreen: ScheduleCreateScreen,
    ScheduleEditScreen: ScheduleEditScreen,
}, {
    navigationOptions: {
        header: null,
    }
})