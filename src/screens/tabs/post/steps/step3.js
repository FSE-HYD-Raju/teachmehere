import React, { useState, useEffect } from 'react';
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
  RadioButton,
  Checkbox,
} from 'react-native-paper';
import { postStep2ValidationSchema } from '../../../../utils/validations';
import {
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { withTheme } from 'react-native-paper';
import TextInputWithIcon from '../../../../components/common/TextInputWithIcon';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const Step3 = props => {
  const { colors } = props.theme;
  const { getState, saveState } = props;
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('');

  const showDatepicker = type => {
    Keyboard.dismiss();
    setShow(true);
    setMode('date');
    setType(type);
  };

  const showTimepicker = type => {
    Keyboard.dismiss();
    setShow(true);
    setMode('time');
    setType(type);
  };

  const handleDateTimeChange = (event, selectedValue) => {
    console.log('selectedValue', event, selectedValue);
    setShow(false);
    if (event.type === 'set') {
      switch (type) {
        case 'startDate':
          saveState({
            startDate: moment(selectedValue).format('L'),
          });
          break;
        case 'endDate':
          saveState({
            endDate: moment(selectedValue).format('L'),
          });
          break;
        case 'startTime':
          saveState({
            startTime: moment(selectedValue).format('LT'),
          });
          break;
        case 'endTime':
          saveState({
            endTime: moment(selectedValue).format('LT'),
          });
          break;
        default:
          setShow(false);
      }
    }
  };

  const updateState = day => {
    const { saveState, getState } = props;
    const { daysofweek } = getState();
    const i = daysofweek.findIndex(weekDay => weekDay.name === day.name);
    let days = JSON.parse(JSON.stringify(daysofweek));
    days[i].checked = true;
    saveState({ daysofweek: days });
  };

  return (
    <View>
      <Appbar.Header theme={DarkTheme} style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={props.back} />
        <Appbar.Content title="Plan Your Time" />
        <Text style={styles.skipButton} onPress={props.next}>
          Skip
        </Text>
        <Appbar.Action icon="skip-next" onPress={props.next} />
      </Appbar.Header>
      <View style={styles.container}>
        <Formik
          initialValues={
            {
              // startDate: getState().startDate || '',
              // endDate: getState().endDate || '',
              // startTime: getState().startTime || '',
              // endTime: getState().endTime || '',
              // onDays: getState().onDays || 'Daily',
              // isTentativeSchedule: getState().isTentativeSchedule || false,
            }
          }
          onSubmit={values => {
            props.next();
            saveState(values);
          }}>
          {formProps => (
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ width: '48%' }}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInputWithIcon
                    placeholder={'Start date'}
                    placeholderTextColor={'#7777'}
                    keyboardType={'numeric'}
                    // handleChange={formProps.handleChange('startDate')}
                    value={getState().startDate}
                    handleFocus={() => showDatepicker('startDate')}
                    handleIconClick={() => showDatepicker('startDate')}
                    iconName={'date-range'}
                    iconColor={'#777'}
                  />
                  <Text style={styles.errorText}>
                    {formProps.touched.startDate && formProps.errors.startDate}
                  </Text>
                </View>
                <View style={{ width: '48%' }}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInputWithIcon
                    placeholder={'End date'}
                    placeholderTextColor={'#7777'}
                    keyboardType={'numeric'}
                    //	onBlur={formProps.handleBlur('endDate')}
                    handleFocus={() => showDatepicker('endDate')}
                    handleIconClick={() => showDatepicker('endDate')}
                    value={getState().endDate}
                    iconName={'date-range'}
                    iconColor={'#777'}
                  />
                  <Text style={styles.errorText}>
                    {formProps.touched.endDate && formProps.errors.endDate}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ width: '48%' }}>
                  <Text style={styles.label}>Start Time</Text>
                  <TextInputWithIcon
                    placeholder={'Start Time'}
                    placeholderTextColor={'#7777'}
                    keyboardType={'numeric'}
                    //	onBlur={formProps.handleBlur('startTime')}
                    handleFocus={() => showTimepicker('startTime')}
                    handleIconClick={() => showTimepicker('startTime')}
                    value={getState().startTime}
                    iconName={'timer'}
                    iconColor={'#777'}
                  />
                  <Text style={styles.errorText}>
                    {formProps.touched.startTime && formProps.errors.startTime}
                  </Text>
                </View>
                <View style={{ width: '48%' }}>
                  <Text style={styles.label}>End Time</Text>
                  <TextInputWithIcon
                    placeholder={'End Time'}
                    placeholderTextColor={'#7777'}
                    keyboardType={'numeric'}
                    //onBlur={formProps.handleBlur('endTime')}
                    handleFocus={() => showTimepicker('endTime')}
                    handleIconClick={() => showTimepicker('endTime')}
                    value={getState().endTime}
                    iconName={'timer'}
                    iconColor={'#777'}
                  />
                  <Text style={styles.errorText}>
                    {formProps.touched.endTime && formProps.errors.endTime}
                  </Text>
                </View>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  minimumDate={new Date()}
                  display="spinner"
                  onChange={(event, selectedValue) =>
                    handleDateTimeChange(event, selectedValue)
                  }
                />
              )}
              <Text style={styles.label}>Teach on specific days</Text>
              <RadioButton.Group
                theme={DarkTheme}
                onValueChange={value => saveState({ onDays: value })}
                value={getState().onDays}>
                <View style={{ flexDirection: 'row' }}>
                  <RadioButton value="Daily" />
                  <Text style={{ marginTop: 8 }}>Daily</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <RadioButton value="Weekends" />
                  <Text style={{ marginTop: 8 }}>Weekends</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <RadioButton value="specificDays" />
                  <Text style={{ marginTop: 8 }}>Specific Days</Text>
                </View>
              </RadioButton.Group>
              {getState().onDays === 'specificDays' && (
                <View style={{ marginLeft: 40, height: 150, flexWrap: 'wrap' }}>
                  {getState().daysofweek &&
                    getState().daysofweek.map((day, index) => {
                      return (
                        <TouchableOpacity
                          style={{ flexDirection: 'row' }}
                          onPress={() => updateState(day)}
                          key={index}>
                          <Checkbox
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            title="checkbox 1"
                            checkedColor="red"
                            //onPress={() => updateState(day)}
                            status={day.checked ? 'checked' : 'unchecked'}
                          />
                          <Text style={{ marginTop: 9, fontSize: 14 }}>
                            {day.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Text style={{ fontSize: 13, margin: 5 }}>
                  My schedule is Tentetive
                </Text>

                <Switch
                  value={!!getState().isTentativeSchedule}
                  onValueChange={() =>
                    saveState({
                      isTentativeSchedule: !getState().isTentativeSchedule,
                    })
                  }
                  color={'black'}
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

export default withTheme(Step3);
