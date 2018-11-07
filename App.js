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

let db;

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
    // newLoginはログイン時に画面遷移する前に処理を行わせるためのstate
    this.state = {
      loading: true,
      fontLoaded: false,
      user: null,
      newLogin: false,
      schedules: [],
      facebookFriends: [],
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
    this.authSubscription = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        db = firebase.firestore();
        settings = { timestampsInSnapshots: true };
        db.settings(settings);
        this.setState({user});
        const provider = user.providerData[0].providerId;
        db.collection('users').doc(user.uid)
          .get()
          .then(doc => {
            const token = doc.data().accessToken;
            this.getFriendsList(provider, token);
          })
      } else {
        this.setState({ user: 'noUser' });
      }
      this.setState({ loading: false });
    });
  }

  async getFriendsList(provider, token) {
    // facebookの場合友達リストを取得
    if (provider == 'facebook.com') {
      let result = [];
      const response = await fetch(`https://graph.facebook.com/me/friends?access_token=${token}`);
      const datas = await response.json();
      if (datas) {
        datas.data.forEach((data, i) => {
          db.collection('users').where('facebookId', '==', data.id)
          .get()
          .then(snapShot => {
            const {email, image, name} = snapShot.docs[0].data();
              result = [...result, {email, image, name}]
              if (datas.data.length == i + 1) {
                this.setState({ facebookFriends: result});
              }
          })
        });
      }
    } 
  }

  newLogin() {
    this.setState({newLogin: !this.state.newLogin});
  }

  updateDisplayName() {
    this.setState({ user: firebase.auth().currentUser, newLogin: false });
  }

  render() {
    if (this.state.fontLoaded && !this.state.loading && this.state.user) {
      // ログイン状態によって画面遷移
      if (this.state.user !== 'noUser' && !this.state.newLogin) {
        if (this.state.user.displayName) {
          return <AppDrawerNavigator screenProps={{ facebookFriends: this.state.facebookFriends }} />
        } else {
          // ユーザー名設定画面
          return <DisplayNameSettingScreen screenProps={{ updateDisplayName: () => this.updateDisplayName() }} />
        }
      } else {
        return <LoginStackNavigator screenProps={{ newLogin: () => this.newLogin(), updateDisplayName: () => this.updateDisplayName() }}/>
      }
    } else {
      return <LoadingScreen />
    }
  }
}