import React from 'react';
import { Header, Left, Right, Icon, Container, Button, Body, Title, Text } from 'native-base';
import { Font, AppLoading } from "expo";
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import store, {persistor} from './store';
import * as Actions from './actions/actions';
import AppStackNavigator from './navigators/AppStackNavigator';
import { PersistGate } from 'redux-persist/integration/react'

const mapStateToProps = (state) => {
  return state.nav;
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
  state = {
    fontLoaded: false,
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    const props = this.props;
      return (
        <Container>
        {
          this.state.fontLoaded ? (
              <AppStackNavigator />
            ) : <AppLoading />
        }
        </Container>
      );
  }
}
const AppMain =  connect(mapStateToProps, mapDispatchToProps)(Main);

