import React from 'react';
import { View, StyleSheet } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import useDataInput from '@/hooks/useDataInput';
import ComboBox from './combobox-holder/ComboBox';

const ids = [
  { label: 'National ID', value: 'National ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'Drivers License', value: 'Drivers License' },
  { label: 'Philhealth ID', value: 'Philhealth ID' },
  { label: 'Voters ID', value: 'Voters ID' },
  { label: 'Postal ID', value: 'Postal ID' },
  { label: 'PRC ID', value: 'PRC ID' },

];







interface BarangayProps {
  value: string | null;
  onValueChange: (value: string) => void;
  
}

const Sitio: React.FC<BarangayProps>  = ({ value, onValueChange }) => {
  

  return (
    <View style={styles.container}>
      <ComboBox data={ids} value={value} onValueChange={onValueChange} placeholder='Select ID Type...' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 41,
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginBottom: 50
  },
});



export default Sitio;
