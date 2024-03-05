import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable'
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ db }) => {
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
    <Animatable.View animation='fadeInUp' style={styles.container}>
      < ImageBackground style={styles.image} source={require('../assets/background2.jpeg')} resizeMode='cover'  >
      <Text style={styles.appName}>Mi negocio</Text>

        {/* <Image source={require('../assets/icono1.jpeg')} style={styles.logo} resizeMode="contain" /> */}
        {/* <Text style={styles.cardTitle}>Control de ingresos</Text> */}


        <View style={styles.inputContainer}>
          <MaterialIcons name="attach-money" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={ventas}
            onChangeText={text => setVentas(text)}
            keyboardType="numeric"
            placeholder="Ventas"

          />
        </View>


        <View style={styles.inputContainer}>
          <MaterialIcons name="attach-money" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={costos}
            onChangeText={text => setCostos(text)}
            keyboardType="numeric"
            placeholder="Costos"
          />

        </View>


        <View style={styles.inputContainer}>
          <MaterialIcons name="attach-money" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={gastos}
            onChangeText={text => setGastos(text)}
            keyboardType="numeric"
            placeholder="Gastos"
          />

        </View>
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>

          <Text style={styles.cardText}>Utilidad Bruta:   $ {utilidadBruta}</Text>
          <Text style={styles.cardText}>Utilidad Operativa:   $ {utilidadOperativa}</Text>
          <Text style={styles.cardText}>Margen bruto:   $ {margenBruto}</Text>
          <Text style={styles.cardText}>Margen operativo:   $ {margenOperativo}</Text>
          <Text style={styles.cardText}>Impacto gasto:   $ {impactoGasto}</Text>


        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (ventas === '' || costos === '' || gastos === '') && styles.disabledButton]}
          onPress={agregarVenta}
          disabled={ventas === '' || costos === '' || gastos === ''}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={verVentas}>
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
      </ImageBackground>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,


  },
  logo: {
    width: '90%',
    height: '10%',
    marginBottom: 10,
    borderRadius: 50
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#bf761f',
    marginBottom: 10,
    width: '80%'
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
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
    fontSize: 18,
    marginBottom: 5,
    right: 20
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: 15,
    width: '80%',
    marginVertical:10

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 20
  },
  appName: {
    fontSize: 45, // Tamaño grande
    fontWeight: 'bold', // Fuente en negrita
    color: '#4a4312', // Color llamativo (rojo coral)
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra de texto
   // textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra
    textShadowRadius: 10, // Radio de la sombra
  },

});

export default HomeScreen;
