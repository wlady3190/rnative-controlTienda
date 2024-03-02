import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import CalculateScreen from '../screens/CalculateScreen';
import HistorialScreen from '../screens/HistorialScreen';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName='Calculate' >
            <Stack.Screen name="Calculate" component={CalculateScreen} />
            <Stack.Screen name="Historial" component={HistorialScreen} />

        </Stack.Navigator>
    );
}



export default function ContainerApp() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}