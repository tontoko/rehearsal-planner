import AppDrawerNavigator from './AppDrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';

export default AppStackNavigator = createStackNavigator({
    login: LoginScreen,
    drawer: AppDrawerNavigator,
}, {
    navigationOptions: {
        header: null,
    }
})