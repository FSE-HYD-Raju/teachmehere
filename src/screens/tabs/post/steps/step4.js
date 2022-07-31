import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Keyboard,
} from 'react-native';
import styles from './styles';
import { Formik } from 'formik';
import { Appbar, Switch, Button } from 'react-native-paper';
import { postStep4ValidationSchema } from '../../../../utils/validations';
import {
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { withTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPost,
  postSelector,
  postNewSkill,
} from '../../../../redux/slices/post';
import Loader from '../../../../components/common/Loader';

const Step4 = props => {
  const { getState, saveState } = props;
  const { postResponse, isPostQueryActive, hasErrors, loading } = useSelector(
    postSelector,
  );
  const [disableSubmit, setDisableSubmit] = React.useState(false);

  return (
    <View>
      <Appbar.Header theme={DarkTheme} style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={props.back} />
        <Appbar.Content title="Platform to Interact" />
      </Appbar.Header>
      <View style={styles.container}>
        <Formik
          initialValues={{
            platform: getState().platform || '',
            tags: getState().tags || [],
            experience: getState().experience || '',
            profileSummary: getState().profileSummary || '',
            linkedInProfile: getState().linkedInProfile || '',
            availableForDemo: getState().availableForDemo || false,
          }}
          validationSchema={postStep4ValidationSchema}
          onSubmit={values => {
            setDisableSubmit(true);
            saveState(values);
            props.next();
          }}>
          {formProps => (
            <View style={styles.container}>
              <Text style={styles.label}>Platform</Text>
              <TextInput
                placeholder="Platform. ex: Skype, Teams, etc."
                placeholderTextColor={'#7777'}
                style={styles.input}
                onChangeText={formProps.handleChange('platform')}
                onBlur={formProps.handleBlur('platform')}
                value={formProps.values.platform}
              />
              <Text style={styles.errorText}>
                {formProps.touched.platform && formProps.errors.platform}
              </Text>
              <Text style={styles.label}>Tags</Text>
              <TextInput
                placeholder="Add some tags. ex: angular, react, etc"
                placeholderTextColor={'#7777'}
                style={styles.input}
                onChangeText={formProps.handleChange('tags')}
                onBlur={formProps.handleBlur('tags')}
                value={formProps.values.tags}
              />
              <Text style={styles.tags}>
                {formProps.touched.tags && formProps.errors.tags}
              </Text>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                placeholder="Expirience in years ex: 2, 2.5 etc"
                placeholderTextColor={'#7777'}
                style={styles.input}
                keyboardType={'numeric'}
                onChangeText={formProps.handleChange('experience')}
                onBlur={formProps.handleBlur('experience')}
                value={formProps.values.experience}
              />
              <Text style={styles.errorText}>
                {formProps.touched.totalHours && formProps.errors.experience}
              </Text>
              <Text style={styles.label}>Profile Summary</Text>
              <TextInput
                placeholderTextColor={'#7777'}
                style={styles.inputTextArea}
                onChangeText={formProps.handleChange('profileSummary')}
                value={formProps.values.profileSummary}
                multiline={true}
                numberOfLines={4}
                scrollEnabled={true}
                placeholder={'Describe your experience. '}
              />
              <Text style={styles.profileSummary}>
                {formProps.touched.totalHours &&
                  formProps.errors.profileSummary}
              </Text>
              <Text style={styles.label}>LinkedIn Profile</Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  fontSize: 14,
                  borderRadius: 6,
                  height: 44,
                }}>
                <View style={{ backgroundColor: '#ddd' }}>
                  <Text style={{ padding: 12 }}>
                    https://www.linkedin.com/in/
                  </Text>
                </View>
                <TextInput
                  placeholder={'user ID'}
                  placeholderTextColor={'#777'}
                  style={{ marginLeft: 3 }}
                  onChangeText={formProps.handleChange('linkedInProfile')}
                  value={formProps.values.linkedInProfile}
                />
              </View>
              <Text style={styles.errorText}>
                {formProps.touched.linkedInProfile &&
                  formProps.errors.linkedInProfile}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Text style={{ fontSize: 13, margin: 5 }}>
                  Available for a short demo
                </Text>
                <Switch
                  value={formProps.values.availableForDemo}
                  onValueChange={() => {
                    saveState({
                      availableForDemo: !formProps.values.availableForDemo,
                    });
                    formProps.setFieldValue(
                      'availableForDemo',
                      !formProps.values.availableForDemo,
                    );
                  }}
                  color={'black'}
                />
              </View>
              {formProps.errors.availableForDemo && (
                <Text style={styles.errorText}>
                  {formProps.touched.availableForDemo &&
                    formProps.errors.availableForDemo}
                </Text>
              )}
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnStyle}>
                  <Button
                    mode="contained"
                    color={'black'}
                    labelStyle={styles.btnLabelStyle}
                    onPress={formProps.handleSubmit}
                    disabled={disableSubmit}>
                    <Text>
                      {getState()._id ? 'Update Skill' : 'Post My Skill'}
                    </Text>
                  </Button>
                </TouchableOpacity>
              </View>
              <Loader loading={loading} />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default withTheme(Step4);
