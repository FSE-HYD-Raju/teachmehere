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
import { Dialog, Portal, List, Button, Appbar } from 'react-native-paper';
import { postStep1ValidationSchema } from '../../../../utils/validations';
import { Icon } from 'react-native-elements';
import {
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { withTheme } from 'react-native-paper';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';

const Step1 = props => {
  const { getState, saveState } = props;

  const [showDailog, setshowDailog] = useState(false);
  const [content, setContent] = useState();
  const [userState, setUserState] = useState(props.userState || {});

  const { colors } = props.theme;
  const { contents = [] } = getState();

  const options = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const addContent = () => {
    if (content) {
      saveState({ contents: [...contents, content] });
      setContent('');
    }
  };

  const removeContent = data => {
    const newContents = contents.filter(e => e !== data);
    saveState({ contents: newContents });
  };

  const contentsChange = (val, index) => {
    let oriContents = contents
    oriContents[index] = val
    saveState({ contents: [...oriContents] })
  }

  return (
    <View>
      <Appbar.Header theme={DarkTheme} style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={props.backFromSteps} />
        <Appbar.Content title="Skill Details" />
      </Appbar.Header>
      {/* <View>
        <TouchableOpacity
          onPress={props.backFromSteps}
          style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>{"Skill Details"}</Text>
      </View> */}
      <View style={styles.container}>
        <Formik
          initialValues={{
            skillName: userState?.skillName || '',
            skillLevel: userState?.skillLevel || '',
            totalHours: userState?.totalHours || '',
          }}
          validationSchema={postStep1ValidationSchema}
          onSubmit={values => {
            props.next();
            props.saveState(values);
            if (!props.getState().languages) {
              props.saveState({ languages: ['English'] });
            }
          }}>
          {formProps => (
            <View style={styles.container}>
              <Text style={styles.label}>Skill Name*</Text>
              <TextInput
                placeholder="Name of the skill you are offering"
                placeholderTextColor={'#7777'}
                style={styles.input}
                onChangeText={formProps.handleChange('skillName')}
                onBlur={formProps.handleBlur('skillName')}
                value={formProps.values.skillName}
              />
              <Text style={styles.errorText}>
                {formProps.touched.skillName && formProps.errors.skillName}
              </Text>
              <Text style={styles.label}>Skill Level*</Text>
              <TextInput
                placeholder="Skill level"
                placeholderTextColor={'#7777'}
                style={styles.input}
                onFocus={() => {
                  Keyboard.dismiss();
                  setshowDailog(true);
                }}
                onBlur={formProps.handleBlur('skillLevel')}
                value={formProps.values.skillLevel}
              />
              <Portal>
                <Dialog
                  visible={showDailog}
                  onDismiss={() => setshowDailog(false)}>
                  <Dialog.Title>Select Skill Level</Dialog.Title>
                  <Dialog.Content>
                    {options.map(data => {
                      return (
                        <List.Item
                          key={data.key}
                          title={data.label}
                          onPress={() => {
                            setshowDailog(false);
                            formProps.setFieldValue('skillLevel', data.label);
                          }}
                        />
                      );
                    })}
                  </Dialog.Content>
                </Dialog>
              </Portal>
              <Text style={styles.errorText}>
                {formProps.touched.skillLevel && formProps.errors.skillLevel}
              </Text>
              <Text style={styles.label}>Total Hours*</Text>
              <TextInput
                placeholder="# of hrs to complete the course"
                placeholderTextColor={'#7777'}
                style={styles.input}
                keyboardType={'numeric'}
                onChangeText={formProps.handleChange('totalHours')}
                onBlur={formProps.handleBlur('totalHours')}
                value={formProps.values.totalHours}
              />
              <Text style={styles.errorText}>
                {formProps.touched.totalHours && formProps.errors.totalHours}
              </Text>
              <Text style={styles.label}>Contents</Text>
              {!!contents &&
                contents.map((data, index) => {
                  return (
                    <View style={styles.column}>
                      <View style={styles.bullet}>
                        <Text style={{ fontSize: 22 }}>{'\u2022' + ' '}</Text>
                        <TextInput style={{ width: '90%' }} value={data} onChangeText={(val) => contentsChange(val, index)} multiline />
                      </View>
                      <TouchableOpacity
                        style={styles.removeContent}
                        onPress={() => removeContent(data)}>
                        <Icon name="delete" color="#444" size={18} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputStyle}
                  autoCorrect={true}
                  placeholder={'Add content line'}
                  value={content}
                  onChangeText={val => setContent(val)}
                  multiline
                />
                <TouchableOpacity onPress={() => addContent()}>
                  <Icon
                    name="add"
                    color="#000"
                    size={23}
                    style={{ marginTop: 20, marginRight: 15 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnStyle}>
                  <Button
                    mode="contained"
                    color={'black'}
                    labelStyle={styles.btnLabelStyle}
                    onPress={() => {
                      if (content) {
                        addContent()
                      }
                      formProps.handleSubmit()
                    }}>
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

export default withTheme(Step1);
