import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

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
  
    // Actualizar el estado fuera de la transacción
    let existingNames = mostrarVentas.filter(venta => venta.id !== id);
    setMostrarVentas(existingNames);
  };
  

   useEffect(() => {

    imprimirVentas()

   }, [])
  const ventasInvertidas = mostrarVentas.slice().reverse();


  return (

    <View style={styles.container}>
      <ScrollView>


        {/* Lista de tarjetas */}
        {ventasInvertidas.map((venta, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => console.log("ID de transacción:", venta.id)}>
            <Text style={styles.cardTitle}>ID de Transacción: {venta.id}</Text>
            <Text style={styles.cardText}>Fecha: {venta.fecha}</Text>
            <Text style={styles.cardText}>Costos: {venta.costos}</Text>
            <Text style={styles.cardText}>Gastos: {venta.gastos}</Text>
            <Text style={styles.cardText}>Utilidad Bruta: {venta.utilidadBruta}</Text>
            <Text style={styles.cardText}>Utilidad Operativa: {venta.utilidadOperativa}</Text>
            <Text style={styles.cardText}>Margen Bruto: {venta.margenBruto}</Text>
            <Text style={styles.cardText}>Margen Operativo: {venta.margenOperativo}</Text>
            <Text style={styles.cardText}>Impacto Gasto: {venta.impactoGasto}</Text>


            <TouchableOpacity style={styles.button} onPress={()=>borrarVenta(venta.id)}>
              <Text style={styles.buttonText}>Borrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

          {/* <TouchableOpacity style={styles.button} onPress={imprimirVentas}>
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>   */}
      </ScrollView>
    </View>

  );
}

export default HistorialScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    width: '80%',
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});