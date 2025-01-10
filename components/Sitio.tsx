import React from 'react';
import { View, StyleSheet } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import useDataInput from '@/hooks/useDataInput';
import ComboBox from './combobox-holder/ComboBox';

const sitios = [
  { label: 'Sitio Centro', value: 'Sitio Centro' },
  { label: 'Sitio Pag-asa', value: 'Sitio Pag-asa' },
  { label: 'Sitio Tañedo', value: 'Sitio Tañedo' },
  { label: 'Sitio Maligaya', value: 'Sitio Maligaya' },
  { label: 'Sitio Tabane', value: 'Sitio Tabane' },
  { label: 'Zone 1', value: 'Zone 1' },
  { label: 'Zone 2', value: 'Zone 2' },
  { label: 'Zone 3', value: 'Zone 3' },
  { label: 'Zone 4', value: 'Zone 4' },
  { label: 'Zone 5', value: 'Zone 5' },
  { label: 'Zone 6', value: 'Zone 6' },
  { label: 'Zone 7', value: 'Zone 7' },
  { label: 'Purok 1', value: 'Purok 1' },
  { label: 'Purok 2', value: 'Purok 2' },
  { label: 'Purok 3', value: 'Purok 3' },
  { label: 'Sitio Apalang', value: 'Sitio Apalang' },
  { label: 'Sitio Apalucung', value: 'Sitio Apalucung' },
  { label: 'Sitio Bayabas', value: 'Sitio Bayabas' },
  { label: 'Sitio Dam', value: 'Sitio Dam' },
  { label: 'Sitio Maniknik', value: 'Sitio Maniknik' },
  { label: 'Sitio Proper', value: 'Sitio Proper' },
  { label: 'Sitio Sampalok', value: 'Sitio Sampalok' },
  { label: 'Sitio Pasaldacan', value: 'Sitio Pasaldacan' },
  { label: 'Sitio Pandan', value: 'Sitio Pandan' },
  { label: 'Sitio Baugo', value: 'Sitio Baugo' },
  { label: 'Sitio Riverside', value: 'Sitio Riverside' },
  { label: 'Sitio Pakulyo', value: 'Sitio Pakulyo' },
  { label: 'Sitio Istasyon', value: 'Sitio Istasyon' },
  { label: 'Sitio Naayat', value: 'Sitio Naayat' },
  { label: 'Sitio Masagana', value: 'Sitio Masagana' },
  { label: 'Sitio Rangayan', value: 'Sitio Rangayan' },
  { label: 'Sitio Namihana', value: 'Sitio Namihana' },
  { label: 'Sitio Saranay', value: 'Sitio Saranay' },
  { label: 'Sitio Nagasat', value: 'Sitio Nagasat' },
  { label: 'Sitio Libutad Asikan', value: 'Sitio Libutad Asikan' },
  { label: 'Sitio Lele Sapa', value: 'Sitio Lele Sapa' },
  { label: 'Sitio Paroba', value: 'Sitio Paroba' },
  { label: 'Sitio Pangulo', value: 'Sitio Pangulo' },
  { label: 'Sitio Paninaan', value: 'Sitio Paninaan' },
  { label: 'Sitio Tambol', value: 'Sitio Tambol' },
  { label: 'Sitio Baguindoc', value: 'Sitio Baguindoc' },
  { label: 'Sitio Patalan', value: 'Sitio Patalan' },
  { label: 'Sitio Taguan', value: 'Sitio Taguan' },
  { label: 'Sitio Pandayan', value: 'Sitio Pandayan' },
  { label: 'Sitio Tibag', value: 'Sitio Tibag' },
  { label: 'Sitio Santo Niño', value: 'Sitio Santo Niño' },
  { label: 'Sitio Lambac', value: 'Sitio Lambac' },
  { label: 'Sitio San Juan', value: 'Sitio San Juan' },
  { label: 'Sitio Bacong', value: 'Sitio Bacong' },
  { label: 'Sitio Calibungan', value: 'Sitio Calibungan' },
  { label: 'Sitio Sapasap', value: 'Sitio Sapasap' },
  { label: 'Sitio Bayu Asinan', value: 'Sitio Bayu Asinan' },
  { label: 'Sitio Lucsuhin', value: 'Sitio Lucsuhin' },
  { label: 'Sitio Ipil-ipil', value: 'Sitio Ipil-ipil' },
  { label: 'Sitio Cayambanan', value: 'Sitio Cayambanan' },
  { label: 'Purok 5', value: 'Purok 5' },
  { label: 'Sitio Balobal', value: 'Sitio Balobal' },
  { label: 'Sitio Tamacan', value: 'Sitio Tamacan' },
  { label: 'Sitio Panginay', value: 'Sitio Panginay' },
  { label: 'Sitio Manggahan', value: 'Sitio Manggahan' },
  { label: 'Sitio Libutad', value: 'Sitio Libutad' },
  { label: 'Sitio Apapaya', value: 'Sitio Apapaya' },
  { label: 'Sitio Bungad', value: 'Sitio Bungad' },
  { label: 'Sitio Tabuan', value: 'Sitio Tabuan' },
  { label: 'Sitio Crossing', value: 'Sitio Crossing' },
  { label: 'Sitio Tansan', value: 'Sitio Tansan' },
  { label: 'Sitio Pulong Gubat', value: 'Sitio Pulong Gubat' },
  { label: 'Sitio Estacion', value: 'Sitio Estacion' },
  { label: 'Sitio Macalinao', value: 'Sitio Macalinao' },
  { label: 'Sitio Santor', value: 'Sitio Santor' },
  { label: 'Sitio Pajo', value: 'Sitio Pajo' }
];







interface BarangayProps {
  value: string | null;
  onValueChange: (value: string) => void;
  
}

const Sitio: React.FC<BarangayProps>  = ({ value, onValueChange }) => {
  

  return (
    <View style={styles.container}>
      <ComboBox data={sitios} value={value} onValueChange={onValueChange} placeholder='Select...' />
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
  },
});



export default Sitio;
