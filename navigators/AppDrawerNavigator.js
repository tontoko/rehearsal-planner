import HomeStackNavigator from "./HomeStackNavigator";
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import SettingsScreen from '../screens/SettingsScreen';

const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
            <Text>CustomedHeader</Text>
        </View>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)



export default AppDrawerNavigator = createDrawerNavigator({
    Home: HomeStackNavigator,
    Settings: SettingsScreen,
}, {
        contentComponent: CustomDrawerComponent,
    })
