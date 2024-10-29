import React from 'react';
import { View, StyleSheet } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import useDataInput from '@/hooks/useDataInput';
import ComboBox from './combobox-holder/ComboBox';

const sitios = [
  { label: 'Sitio Centro', value: 'Sitio Centro', barangay: 'Aguso' },
  { label: 'Sitio Pag-asa', value: 'Sitio Pag-asa', barangay: 'Aguso' },
  { label: 'Sitio Tañedo', value: 'Sitio Tañedo', barangay: 'Aguso' },
  { label: 'Sitio Maligaya', value: 'Sitio Maligaya', barangay: 'Aguso' },
  { label: 'Sitio Tabane', value: 'Sitio Tabane', barangay: 'Aguso' },
  { label: 'Zone 1', value: 'Zone 1', barangay: 'Alvindia' },
  { label: 'Zone 2', value: 'Zone 2', barangay: 'Alvindia' },
  { label: 'Zone 3', value: 'Zone 3', barangay: 'Alvindia' },
  { label: 'Zone 4', value: 'Zone 4', barangay: 'Alvindia' },
  { label: 'Zone 5', value: 'Zone 5', barangay: 'Alvindia' },
  { label: 'Zone 6', value: 'Zone 6', barangay: 'Alvindia' },
  { label: 'Zone 7', value: 'Zone 7', barangay: 'Alvindia' },
  { label: 'Purok 1', value: 'Purok 1', barangay: 'Amucao' },
  { label: 'Purok 2', value: 'Purok 2', barangay: 'Amucao' },
  { label: 'Purok 3', value: 'Purok 3', barangay: 'Amucao' },
  { label: 'Sitio Apalang', value: 'Sitio Apalang', barangay: 'Armenia' },
  { label: 'Sitio Apalucung', value: 'Sitio Apalucung', barangay: 'Armenia' },
  { label: 'Sitio Bayabas', value: 'Sitio Bayabas', barangay: 'Armenia' },
  { label: 'Sitio Dam', value: 'Sitio Dam', barangay: 'Armenia' },
  { label: 'Sitio Maniknik', value: 'Sitio Maniknik', barangay: 'Armenia' },
  { label: 'Sitio Proper', value: 'Sitio Proper', barangay: 'Armenia' },
  { label: 'Sitio Sampalok', value: 'Sitio Sampalok', barangay: 'Armenia' },
  { label: 'Sitio Pasaldacan', value: 'Sitio Pasaldacan', barangay: 'Atioc' },
  { label: 'Purok 1', value: 'Purok 1', barangay: 'Atioc' },
  { label: 'Purok 2', value: 'Purok 2', barangay: 'Atioc' },
  { label: 'Purok 3', value: 'Purok 3', barangay: 'Atioc' },
  { label: 'Purok 4', value: 'Purok 4', barangay: 'Atioc' },
  { label: 'Sitio Pandan', value: 'Sitio Pandan', barangay: 'Balanti' },
  { label: 'Sitio Baugo', value: 'Sitio Baugo', barangay: 'Balanti' },
  { label: 'Sitio Riverside', value: 'Sitio Riverside', barangay: 'Balanti' },
  { label: 'Sitio Pakulyo', value: 'Sitio Pakulyo', barangay: 'Balibago II' },
  { label: 'Sitio Istasyon', value: 'Sitio Istasyon', barangay: 'Balibago II' },
  { label: 'Sitio Naayat', value: 'Sitio Naayat', barangay: 'Baras-baras' },
  { label: 'Sitio Masagana', value: 'Sitio Masagana', barangay: 'Baras-baras' },
  { label: 'Sitio Rangayan', value: 'Sitio Rangayan', barangay: 'Baras-baras' },
  { label: 'Sitio Namihana', value: 'Sitio Namihana', barangay: 'Baras-baras' },
  { label: 'Sitio Saranay', value: 'Sitio Saranay', barangay: 'Baras-baras' },
  { label: 'Sitio Nagasat', value: 'Sitio Nagasat', barangay: 'Baras-baras' },
  { label: 'Sitio Libutad Asikan', value: 'Sitio Libutad Asikan', barangay: 'Binauganan' },
  { label: 'Sitio Lele Sapa', value: 'Sitio Lele Sapa', barangay: 'Binauganan' },
  { label: 'Sitio Paroba', value: 'Sitio Paroba', barangay: 'Carangian' },
  { label: 'Sitio Pangulo', value: 'Sitio Pangulo', barangay: 'Carangian' },
  { label: 'Sitio Paninaan', value: 'Sitio Paninaan', barangay: 'Carangian' },
  { label: 'Sitio Tambol', value: 'Sitio Tambol', barangay: 'Carangian' },
  { label: 'Sitio Baguindoc', value: 'Sitio Baguindoc', barangay: 'Care' },
  { label: 'Sitio Patalan', value: 'Sitio Patalan', barangay: 'Care' },
  { label: 'Sitio Taguan', value: 'Sitio Taguan', barangay: 'Care' },
  { label: 'Sitio Pandayan', value: 'Sitio Pandayan', barangay: 'Calingcuan' },
  { label: 'Sitio Tibag', value: 'Sitio Tibag', barangay: 'Calingcuan' },
  { label: 'Sitio Santo Niño', value: 'Sitio Santo Niño', barangay: 'Calingcuan' },
  { label: 'Sitio Lambac', value: 'Sitio Lambac', barangay: 'Calingcuan' },
  { label: 'Sitio San Juan', value: 'Sitio San Juan', barangay: 'Calingcuan' },
  { label: 'Sitio Bacong', value: 'Sitio Bacong', barangay: 'Culipat' },
  { label: 'Sitio Calibungan', value: 'Sitio Calibungan', barangay: 'Culipat' },
  { label: 'Sitio Sapasap', value: 'Sitio Sapasap', barangay: 'Culipat' },
  { label: 'Sitio Bayu Asinan', value: 'Sitio Bayu Asinan', barangay: 'Cut-cut 1st' },
  { label: 'Sitio Lucsuhin', value: 'Sitio Lucsuhin', barangay: 'Cut-cut 1st' },
  { label: 'Sitio Ipil-ipil', value: 'Sitio Ipil-ipil', barangay: 'Cut-cut 1st' },
  { label: 'Sitio Cayambanan', value: 'Sitio Cayambanan', barangay: 'Cut-cut 2nd' },
  { label: 'Purok 5', value: 'Purok 5', barangay: 'Cut-cut 2nd' },
  { label: 'Sitio Balobal', value: 'Sitio Balobal', barangay: 'Dapdap' },
  { label: 'Sitio Tamacan', value: 'Sitio Tamacan', barangay: 'Dapdap' },
  { label: 'Sitio Panginay', value: 'Sitio Panginay', barangay: 'Dapdap' },
  { label: 'Sitio Manggahan', value: 'Sitio Manggahan', barangay: 'Dapdap' },
  { label: 'Sitio Libutad', value: 'Sitio Libutad', barangay: 'Del Pilar' },
  { label: 'Sitio Riverside', value: 'Sitio Riverside', barangay: 'Del Rosario' },
  { label: 'Sitio Apapaya', value: 'Sitio Apapaya', barangay: 'Del Rosario' },
  { label: 'Sitio Bungad', value: 'Sitio Bungad', barangay: 'Del Rosario' },
  { label: 'Sitio Tabuan', value: 'Sitio Tabuan', barangay: 'Del Rosario' },
  { label: 'Sitio Crossing', value: 'Sitio Crossing', barangay: 'Del Rosario' },
  { label: 'Sitio Tansan', value: 'Sitio Tansan', barangay: 'Ligtasan' },
  { label: 'Sitio Pulong Gubat', value: 'Sitio Pulong Gubat', barangay: 'Ligtasan' },
  { label: 'Sitio Estacion', value: 'Sitio Estacion', barangay: 'Lomboy' },
  { label: 'Sitio Macalinao', value: 'Sitio Macalinao', barangay: 'Lomboy' },
  { label: 'Sitio Santor', value: 'Sitio Santor', barangay: 'Lomboy' },
  { label: 'Sitio Pajo', value: 'Sitio Pajo', barangay: 'Maligaya' }
];





interface BarangayProps {
  value: string | null;
  onValueChange: (value: string) => void;
  
}

const Sitio: React.FC<BarangayProps>  = ({ value, onValueChange }) => {
  

  return (
    <View style={styles.container}>
      <ComboBox data={sitios} value={value} onValueChange={onValueChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 40,
    backgroundColor: '#D3D3D3',
    borderColor: '#714423',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000000',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000000',
  },
  placeholder: {
    color: '#888888',
  },
});

export default Sitio;
