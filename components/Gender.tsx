import React from 'react';
import { View, StyleSheet } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import useDataInput from '@/hooks/useDataInput';
import ComboBox from './combobox-holder/ComboBox';

const genders = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];







interface BarangayProps {
  value: string | null;
  onValueChange: (value: string) => void;
  
}

const Sitio: React.FC<BarangayProps>  = ({ value, onValueChange }) => {
  

  return (
    <View style={styles.container}>
      <ComboBox data={genders} value={value} onValueChange={onValueChange} placeholder='Gender' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    height: 41,
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginBottom: 15
  },
});



export default Sitio;
