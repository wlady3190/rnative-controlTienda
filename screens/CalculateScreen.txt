import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, Button } from 'react-native';
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'


const CalculateScreen = ({ navigation }) => {
  const [ventas, setVentas] = useState('');
  const [costos, setCostos] = useState('');
  const [gastos, setGastos] = useState('');
  const [utilidadBruta, setUtilidadBruta] = useState('');
  const [utilidadOperativa, setUtilidadOperativa] = useState('');
  const [margenBruto, setMargenBruto] = useState('');
  const [margenOperativo, setMargenOperativo] = useState('');
  const [impactoGasto, setImpactoGasto] = useState('');
  const [mostrarVentas, setMostrarVentas] = useState([])
  const [db, setDb] = useState(null)
  // const [textBox9, setTextBox9] = useState('');

  const inicializarBaseDeDatos = () => {
    const database = SQLite.openDatabase('ventas.db');
    database.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS ventas (id INTEGER PRIMARY KEY AUTOINCREMENT, ventas TEXT, costos TEXT, gastos TEXT, utilidadBruta TEXT, utilidadOperativa TEXT, margenBruto TEXT, margenOperativo TEXT, impactoGasto TEXT)'
      );
    });
    setDb(database);
  }


  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + 'SQLite/ventas.db',
          {
            encoding: FileSystem.EncodingType.Base64
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'ventas.db', 'application/octet-stream')
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Permission not granted");
      }
    } else {
      await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/ventas.db');
    }
  }

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      setIsLoading(true);

      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }

      const base64 = await FileSystem.readAsStringAsync(
        result.uri,
        {
          encoding: FileSystem.EncodingType.Base64
        }
      );

      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'SQLite/ventas.db', base64, { encoding: FileSystem.EncodingType.Base64 });
      await db.closeAsync();
      setDb(SQLite.openDatabase('ventas.db'));
    }
  };

  useEffect(() => {
    inicializarBaseDeDatos()
    setCostos('')
    setGastos('')
    setVentas('')

  }, [])


  const handleCalculate = () => {


    const valorVentas = parseFloat(ventas);
    const valorCostos = parseFloat(costos);
    const valorGastos = parseFloat(gastos);

    if (ventas === "" || costos === "" || gastos === "") {
      Alert.alert('Complete todos los campos');

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

  //Base de datos
  const agregarVenta = () => {

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ventas (ventas, costos, gastos, utilidadBruta, utilidadOperativa, margenBruto, margenOperativo, impactoGasto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [ventas, costos, gastos, utilidadBruta, utilidadOperativa, margenBruto, margenOperativo, impactoGasto],
        (txObj, resultSet) => {
          console.log('Venta agregada con éxito. ID:', resultSet.insertId);
          // Realiza cualquier acción adicional aquí después de insertar
        },
        (txObj, error) => console.log('Error al agregar venta:', error)
      );
    });
  }


  const imprimirVentas = () => {
    db.transaction(transaction => {
      transaction.executeSql("SELECT * FROM ventas", null,
        (transaction, resultSet) => setMostrarVentas(resultSet.rows._array),
        (transaction, error) => console.log(error))
    })

  }



  const handleSave = () => {

    agregarVenta()


  };

  const showData = () => {
    console.log(imprimirVentas());

    return mostrarVentas.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.ventas}</Text>
          <Button title='Delete' onPress={() => deleteName(name.id)} />
          <Button title='Update' onPress={() => updateName(name.id)} />
        </View>
      );
    });


  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={ventas}
        onChangeText={text => setVentas(text)}
        keyboardType="numeric"
        placeholder='Ventas diarias'
      />
      <TextInput
        style={styles.input}
        value={costos}
        onChangeText={text => setCostos(text)}
        keyboardType="numeric"
        placeholder='Costos diarios'
      />
      <TextInput
        style={styles.input}
        value={gastos}
        onChangeText={text => setGastos(text)}
        keyboardType="numeric"
        placeholder='Gastos diarios'
      />
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      <Text style={styles.result}>Utilidad Bruta: {utilidadBruta}</Text>
      <Text style={styles.result}>Utilidad Operativa: {utilidadOperativa}</Text>
      <Text style={styles.result}>Margen bruto: {margenBruto}</Text>
      <Text style={styles.result}>Margen operativo: {margenOperativo}</Text>
      <Text style={styles.result}>Impacto gasto: {impactoGasto}</Text>
      {/* <TextInput
        style={styles.input}
        value={textBox9}
        onChangeText={text => setTextBox9(text)}
      /> */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showData}>
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
});

export default CalculateScreen;
