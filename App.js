import React from 'react';
import { BackHandler } from "react-native";
import { NavigationActions } from "react-navigation";
import { Font, AppLoading } from "expo";
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import store, {persistor} from './store';
import * as Actions from './actions/actions';
import { PersistGate } from 'redux-persist/integration/react';
import * as firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/ja';
import ENV from './env.json';
import AppDrawerNavigator from './navigators/AppDrawerNavigator';
import LoginStackNavigator from './navigators/LoginStackNavigator'; 
import DisplayNameSettingScreen from './screens/DisplayNameSettingScreen';
moment.locale('ja');

const config = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.FIREBASE_DB_URL,
  projectId: ENV.FIREBASE_PRJ_ID,
  storageBucket: ENV.FIREBASE_STORAGE,
  messagingSenderId: ENV.FIREBASE_SENDER_ID,
};
firebase.initializeApp(config);


const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppMain />
      </PersistGate>
    </Provider>
  );
}

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      fontLoaded: false,
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });

    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
      });
      if (user) {
        this.props.logIn(user);
      } else {
        this.props.logOut(user);
      }
    });
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    this.authSubscription();
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    if (this.state.fontLoaded && !this.state.loading) {
      // ログイン状態によって画面遷移
      if (this.props.user.user) {
        if (this.props.user.user.displayName) {
          return <AppDrawerNavigator />
        } else {
          // ユーザー名設定画面
          return <DisplayNameSettingScreen />
        }
      } else {
        return <LoginStackNavigator />
      }
    } else {
      return <AppLoading />
    }
  }
}
const AppMain =  connect(mapStateToProps, mapDispatchToProps)(Main);

