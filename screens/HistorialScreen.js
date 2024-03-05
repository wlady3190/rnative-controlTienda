import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable'


const HistorialScreen = ({ db }) => {

  const [mostrarVentas, setMostrarVentas] = useState([])
  const imprimirVentas = () => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ventas', null,
        (txObj, resultSet) => setMostrarVentas(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
  }

  const borrarVenta = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM ventas WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log('Borrado');
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  
    let existingNames = mostrarVentas.filter(venta => venta.id !== id);
    setMostrarVentas(existingNames);
  };
  

   useEffect(() => {
    imprimirVentas()
   }, [])

  const ventasInvertidas = mostrarVentas.slice().reverse();

  return (

    <Animatable.View animation='fadeInDownBig' duration={1500} style={styles.container}>


    < ImageBackground style={styles.image} source={require('../assets/background2.jpeg')}resizeMode='cover'  >
      <ScrollView>
        {ventasInvertidas.map((venta, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => console.log("Id:", venta.id)}>
            <Text style={styles.cardTitle}>Transacción: {venta.id}</Text>
            <Text style={styles.cardText}>Fecha: {venta.fecha}</Text>
            <Text style={styles.cardText}>Ingresos: $ {venta.ventas}</Text>
            <Text style={styles.cardText}>Costos: $ {venta.costos}</Text>
            <Text style={styles.cardText}>Gastos: $ {venta.gastos}</Text>
            <Text style={styles.cardText}>Utilidad Bruta: $ {venta.utilidadBruta}</Text>
            <Text style={styles.cardText}>Utilidad Operativa: $ {venta.utilidadOperativa}</Text>
            <Text style={styles.cardText}>Margen Bruto: $ {venta.margenBruto}</Text>
            <Text style={styles.cardText}>Margen Operativo: $ {venta.margenOperativo}</Text>
            <Text style={styles.cardText}>Impacto Gasto: $ {venta.impactoGasto}</Text>


            <TouchableOpacity style={styles.button} onPress={()=>borrarVenta(venta.id)}>
            <MaterialCommunityIcons name="delete" size={24} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
    </Animatable.View>
  );
}

export default HistorialScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    width: '25%',
    height: 40,
    backgroundColor: '#a10d0b',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    padding:30,
    marginTop:6

  },
});