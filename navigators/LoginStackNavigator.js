import CreateAccountScreen from '../screens/CreateAccountScreen';
import LoginScreen from '../screens/LoginScreen';
import { createStackNavigator } from 'react-navigation';

export default LoginStackNavigator = createStackNavigator({
    login: LoginScreen,
    signUp: CreateAccountScreen,
}, {
    navigationOptions: {
        header: null,
    }
})