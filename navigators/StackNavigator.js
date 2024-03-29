import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HistorialScreen from '../screens/HistorialScreen';
import HomeScreen from '../screens/HomeScreen';
import * as SQLite from 'expo-sqlite';



const Stack = createStackNavigator();

function MyStack() {
    const [db, setDb] = useState(null);

    async function initializeDatabase() {
        const database = await openOrCreateDatabase();
        database.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ventas (id INTEGER PRIMARY KEY AUTOINCREMENT,  ventas TEXT, costos TEXT, gastos TEXT, utilidadBruta TEXT, utilidadOperativa TEXT, margenBruto TEXT, margenOperativo TEXT, impactoGasto TEXT, fecha TEXT)'
            );
        });
        setDb(database);
    }

    useEffect(() => {
        initializeDatabase();
    }, []);

    async function openOrCreateDatabase() {
        return SQLite.openDatabase('proyectoTienda.db');
    }


    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Home"  >
                {() => <HomeScreen db={db} />}
            </Stack.Screen>
            <Stack.Screen name="Historial" screenOptions={{ headerShown: true }}>
                {() => <HistorialScreen db={db} />}
            </Stack.Screen>
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
