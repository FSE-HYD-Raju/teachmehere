import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Keyboard,
} from 'react-native';
import styles from './styles';
import { Formik } from 'formik';
import {
  Dialog,
  Portal,
  List,
  Button,
  Appbar,
  Chip,
  Switch,
} from 'react-native-paper';
import { postStep2ValidationSchema } from '../../../../utils/validations';
import {
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Icon } from 'react-native-elements';

import { withTheme } from 'react-native-paper';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';
import AutoCompleteTextInput from '../../../../components/common/autoComplete/AutoCompleteTextInput';

const Step2 = props => {
  const [langError, setLangError] = useState(false);
  const [countries, setCountries] = useState(
    require('../../../../assets/countries.json') || [],
  );
  const defaultCountry = countries.filter(coun => coun.name == 'India') || [];

  useEffect(() => {
    if (!getState().country) selectLanguage(defaultCountry[0]?.language?.name);
    // saveState({ country: defaultCountry[0] });
  }, [countries]);
  const [allLaunguages] = useState(
    require('../../../../assets/languages.json') || [],
  );
  const { getState, saveState } = props;
  const onToggleSwitch = () => {
    saveState({ isGroupSelected: !getState().isGroupSelected });
  };
  const { colors } = props.theme;

  const selectLanguage = lang => {
    const languagesToUpdate = getState().languages;
    const index = languagesToUpdate && languagesToUpdate.indexOf(lang);
    if (index === -1) {
      languagesToUpdate.push(lang);
      setLangError(false);
    }
    saveState({ languages: languagesToUpdate });
  };

  const removeLanguage = lang => {
    const languagesToUpdate = getState().languages;
    const index = languagesToUpdate && languagesToUpdate.indexOf(lang);
    if (index !== -1 && languagesToUpdate.length > 1) {
      languagesToUpdate.splice(index, 1);
    } else {
      setLangError(true);
      setTimeout(function () {
        setLangError(false);
      }, 3000);
    }
    saveState({ languages: languagesToUpdate });
  };

  return (
    <View>
      <Appbar.Header theme={DarkTheme} style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={props.back} />
        <Appbar.Content title="Pricing" />
      </Appbar.Header>
      {/* <View>
        <TouchableOpacity
          onPress={props.back}
          style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>{"Pricing"}</Text>
      </View> */}
      <View style={styles.container}>
        <Formik
          initialValues={{
            country: getState().country || defaultCountry[0] || '',
            individualPrice: getState().individualPrice || '',
            noOfPeople: getState().noOfPeople || '',
            groupPrice: getState().groupPrice || '',
            // languages: [...getState().languages, defaultCountry[0].language.name],
          }}
          validationSchema={postStep2ValidationSchema}
          onSubmit={values => {
            props.next();
            props.saveState(values);
            if (!getState().daysofweek?.length) {
              props.saveState({
                onDays: 'Daily',
                daysofweek: [
                  { name: 'Sun', checked: false },
                  { name: 'Mon', checked: false },
                  { name: 'Tue', checked: false },
                  { name: 'Wed', checked: false },
                  { name: 'Thu', checked: false },
                  { name: 'Fri', checked: false },
                  { name: 'Sat', checked: false },
                ],
                isTentativeSchedule: false,
              });
            }
          }}>
          {formProps => (
            <View style={styles.container}>
              <View>
                <AutoCompleteTextInput
                  data={countries}
                  displayKey="name"
                  label={'Country*'}
                  placeholder="Select a country"
                  value={formProps.values?.country?.name}
                  onSelect={value => {
                    formProps.setFieldValue('country', value);
                    if (value.language && value.language.name)
                      selectLanguage(value?.language?.name);
                  }}
                  maxHeight={200}
                  clearValue={false}
                />
                <Text style={styles.errorText}>
                  {formProps.touched.country && formProps.errors.country}
                </Text>
              </View>
              <Text style={styles.label}>Individual Price*</Text>
              <TextInput
                placeholder="Individual Price"
                placeholderTextColor={'#7777'}
                style={styles.input}
                onChangeText={formProps.handleChange('individualPrice')}
                onBlur={formProps.handleBlur('individualPrice')}
                value={formProps.values.individualPrice}
                keyboardType={'numeric'}
              />
              <Text style={styles.errorText}>
                {formProps.touched.individualPrice &&
                  formProps.errors.individualPrice}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                <Text style={{ fontSize: 13, margin: 5 }}>
                  Interested to teach group as well?
                </Text>
                <Switch
                  value={getState().isGroupSelected}
                  onValueChange={onToggleSwitch}
                  color={'black'}
                />
              </View>
              {getState().isGroupSelected && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ width: '35%' }}>
                    <Text style={styles.label}># Of People</Text>
                    <TextInput
                      placeholder="# of people"
                      placeholderTextColor={'#7777'}
                      style={styles.input}
                      keyboardType={'numeric'}
                      onChangeText={formProps.handleChange('noOfPeople')}
                      onBlur={formProps.handleBlur('noOfPeople')}
                      value={formProps.values.noOfPeople}
                    />
                    <Text style={styles.errorText}>
                      {formProps.touched.noOfPeople &&
                        formProps.errors.noOfPeople}
                    </Text>
                  </View>
                  <View style={{ width: '60%' }}>
                    <Text style={styles.label}>Group Price</Text>
                    <TextInput
                      placeholder="Group price"
                      placeholderTextColor={'#7777'}
                      style={styles.input}
                      keyboardType={'numeric'}
                      onChangeText={formProps.handleChange('groupPrice')}
                      onBlur={formProps.handleBlur('groupPrice')}
                      value={formProps.values.groupPrice}
                    />
                    <Text style={styles.errorText}>
                      {formProps.touched.groupPrice &&
                        formProps.errors.groupPrice}
                    </Text>
                  </View>
                </View>
              )}
              <Text style={styles.label}>Speaking Languages*</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: 5,
                }}>
                {getState().languages &&
                  getState().languages.map(lan => {
                    return (
                      <Chip
                        mode="outlined"
                        style={{ padding: 2, margin: 3 }}
                        onClose={() => removeLanguage(lan)}>
                        {lan}
                      </Chip>
                    );
                  })}
              </View>
              {langError && (
                <Text style={styles.errorText}>
                  {
                    'Atleast one language should be there, Add others to remove this language'
                  }
                </Text>
              )}
              <View style={{ marginTop: 7 }}>
                <AutoCompleteTextInput
                  data={allLaunguages}
                  displayKey="name"
                  placeholder="Select Language"
                  onSelect={lang => selectLanguage(lang?.name || lang)}
                  maxHeight={200}
                  clearValue={true}
                />
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnStyle}>
                  <Button
                    mode="contained"
                    color={'black'}
                    labelStyle={styles.btnLabelStyle}
                    onPress={formProps.handleSubmit}>
                    Next
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default withTheme(Step2);
