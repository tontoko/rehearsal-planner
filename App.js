import React from 'react';
import { BackHandler } from "react-native";
import { NavigationActions } from "react-navigation";
import { Font, AppLoading } from "expo";
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import * as Actions from './actions/actions';
import { PersistGate } from 'redux-persist/integration/react';
import firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/ja';
import ENV from './env.json';
import AppDrawerNavigator from './navigators/AppDrawerNavigator';
import LoginStackNavigator from './navigators/LoginStackNavigator'; 
import DisplayNameSettingScreen from './screens/DisplayNameSettingScreen';
import LoadingScreen from './screens/LoadingScreen';
moment.locale('ja');
require("firebase/firestore");

const config = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.FIREBASE_DB_URL,
  projectId: ENV.FIREBASE_PRJ_ID,
  storageBucket: ENV.FIREBASE_STORAGE,
  messagingSenderId: ENV.FIREBASE_SENDER_ID,
};
firebase.initializeApp(config);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      fontLoaded: false,
      user: null
    };
  }

  async componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
      });
      if (user) {
        const db = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        db.settings(settings);
        db.collection('users').doc(user.uid).set({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        })
        .then(() => {
          this.setState({user});
        });
      } else {
        this.setState({ user: null });
      }
    });
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  componentWillUnmount() {
    this.authSubscription();
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  render() {
    if (this.state.fontLoaded && !this.state.loading) {
      // ログイン状態によって画面遷移
      if (this.state.user) {
        if (this.state.user.displayName) {
          return <AppDrawerNavigator />
        } else {
          // ユーザー名設定画面
          return <DisplayNameSettingScreen />
        }
      } else {
        return <LoginStackNavigator />
      }
    } else {
      return <LoadingScreen />
    }
  }
}