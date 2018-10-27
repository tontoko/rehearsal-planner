import CreateAccountScreen from '../screens/CreateAccountScreen';
import LoginScreen from '../screens/LoginScreen';
import DisplayNameSettingScreen from '../screens/DisplayNameSettingScreen';
import AppDrawerNavigator from './AppDrawerNavigator';
import { createStackNavigator } from 'react-navigation';

export default LoginStackNavigator = createStackNavigator({
    login: LoginScreen,
    signUp: CreateAccountScreen,
    home: AppDrawerNavigator,
    DisplayNameSettingScreen: DisplayNameSettingScreen,
}, {
    navigationOptions: {
        header: null,
    }
})