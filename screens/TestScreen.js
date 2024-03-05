import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

const TestScreen = ({ db }) => {
  const [ventas, setVentas] = useState('');
  const [costos, setCostos] = useState('');
  const [gastos, setGastos] = useState('');
  const [utilidadBruta, setUtilidadBruta] = useState('');
  const [utilidadOperativa, setUtilidadOperativa] = useState('');
  const [margenBruto, setMargenBruto] = useState('');
  const [margenOperativo, setMargenOperativo] = useState('');
  const [impactoGasto, setImpactoGasto] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    setCostos('');
    setGastos('');
    setVentas('');
  }, []);

  const handleCalculate = () => {
    const valorVentas = parseFloat(ventas);
    const valorCostos = parseFloat(costos);
    const valorGastos = parseFloat(gastos);

    if (ventas === '' || costos === '' || gastos === '') {
      Alert.alert('Complete todos los campos');
      setCostos('');
      setGastos('');
      setVentas('');
    } else {
      const valorUtilidadBruta = valorVentas - valorCostos;
      const valorUtilidadOperativa = valorVentas - valorCostos - valorGastos;
      const valorMargenBruto = ((valorUtilidadBruta / valorVentas) * 100).toFixed(0);
      const valorMargenOperativo = ((valorUtilidadOperativa / valorVentas) * 100).toFixed(0);
      const valorImpactoGasto = ((valorGastos / valorVentas) * 100).toFixed(0);

      setUtilidadBruta(valorUtilidadBruta.toString());
      setUtilidadOperativa(valorUtilidadOperativa.toString());
      setMargenBruto(valorMargenBruto.toString());
      setMargenOperativo(valorMargenOperativo.toString());
      setImpactoGasto(valorImpactoGasto.toString());
    }
  };

  const agregarVenta = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ventas (ventas, costos, gastos, utilidadBruta, utilidadOperativa, margenBruto, margenOperativo, impactoGasto, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?,  datetime("now", "localtime"))',
        [ventas, costos, gastos, utilidadBruta, utilidadOperativa, margenBruto, margenOperativo, impactoGasto],
        (txObj, resultSet) => {
          console.log('Venta agregada con éxito. ID:', resultSet.insertId);
        },
        (txObj, error) => console.log('Error al agregar venta:', error)
      );
    });

    setCostos('');
    setGastos('');
    setVentas('');
    setUtilidadBruta('');
    setUtilidadOperativa('');
    setMargenBruto('');
    setMargenOperativo('');
    setImpactoGasto('');




    Alert.alert('Ingresado con éxito');
    verVentas()
  };

  const verVentas = () => {
    navigation.navigate('Historial');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icono1.jpeg')} style={styles.logo} resizeMode="contain" />
      <TextInput
        style={styles.input}
        value={ventas}
        onChangeText={text => setVentas(text)}
        keyboardType="numeric"
        placeholder="Ventas diarias"
      />
      <TextInput
        style={styles.input}
        value={costos}
        onChangeText={text => setCostos(text)}
        keyboardType="numeric"
        placeholder="Costos diarios"
      />
      <TextInput
        style={styles.input}
        value={gastos}
        onChangeText={text => setGastos(text)}
        keyboardType="numeric"
        placeholder="Gastos diarios"
      />
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      {/* <Text style={styles.result}>Utilidad Bruta: {utilidadBruta}</Text>
      <Text style={styles.result}>Utilidad Operativa: {utilidadOperativa}</Text>
      <Text style={styles.result}>Margen bruto: {margenBruto}</Text>
      <Text style={styles.result}>Margen operativo: {margenOperativo}</Text>
      <Text style={styles.result}>Impacto gasto: {impactoGasto}</Text> */}

      <TouchableOpacity style={styles.card}>

        <Text style={styles.cardText}>Utilidad Bruta:   USD {utilidadBruta}</Text>
        <Text style={styles.cardText}>Utilidad Operativa:   USD {utilidadOperativa}</Text>
        <Text style={styles.cardText}>Margen bruto:   USD {margenBruto}</Text>
        <Text style={styles.cardText}>Margen operativo:   USD {margenOperativo}</Text>
        <Text style={styles.cardText}>Impacto gasto:   USD {impactoGasto}</Text>


      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, (ventas === '' || costos === '' || gastos === '') && styles.disabledButton]}
        onPress={agregarVenta}
        disabled={ventas === '' || costos === '' || gastos === ''}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={verVentas}>
        <Text style={styles.buttonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '90%',
    height: '10%',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  result: {
    fontSize: 16,
    marginBottom: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },

  card: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    paddingHorizontal: 60,
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
    right: 20
  },
});

export default TestScreen;
