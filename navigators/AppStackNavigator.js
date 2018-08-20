import AppDrawerNavigator from './AppDrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';

export default AppStackNavigator = createStackNavigator({
    drawer: AppDrawerNavigator,
    login: LoginScreen,
}, {
    navigationOptions: {
        header: null,
    }
})