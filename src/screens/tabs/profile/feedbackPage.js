import React, { Fragment } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import PageSpinner from '../../../components/common/PageSpinner';
import * as yup from 'yup';
import { Formik } from 'formik';
import { changeProfileSelector } from '../../../redux/slices/changeProfileSlice';
import { loginSelector } from '../../../redux/slices/loginSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiRating from '../../../components/common/emojiRating';
import { Snackbar } from 'react-native-paper';
import { submitfeedbackUrl } from '../../../redux/urls';

export default function feedbackPage({ navigation }) {
  const dispatch = useDispatch();
  const { DescriptionError } = useSelector(changeProfileSelector);
  const [feedbackRating, setFeedbackRating] = React.useState('GOOD');
  const [loading, setLoading] = React.useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState('');
  const { userInfo } = useSelector(loginSelector);

  const descriptionComponent = () => {
    const onsubmit = values => {
      var obj = {
        userid: userInfo ? userInfo._id : null,
        username: userInfo ? userInfo.username : null,
        feedbackrating: feedbackRating,
        description: values.description,
      };
      submitFeedback(obj);
    };
    return (
      <Formik
        initialValues={{ description: '' }}
        onSubmit={values => onsubmit(values)}
        validationSchema={yup.object().shape({
          description: yup.string(),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <Fragment>
            <View>
              <TextInput
                style={{
                  borderBottomColor: '#000000',
                  borderBottomWidth: 1,
                }}
                placeholder="Tell us more... "
                multiline
                numberOfLines={4}
                errorMessage={DescriptionError}
                value={values.description}
                onChangeText={e => {
                  handleChange('description')(e);
                }}
                // onBlur={() => setFieldTouched('description')}
              />
              {touched.description && errors.description && (
                <Text
                  style={{
                    fontSize: 12,
                    color: 'red',
                    textAlign: 'center',
                    marginTop: -15,
                  }}>
                  {errors.description}
                </Text>
              )}
            </View>
            <Button
              title="Send"
              disabled={!isValid}
              type="solid"
              containerStyle={styles.loginButton}
              onPress={handleSubmit}
            />
          </Fragment>
        )}
      </Formik>
    );
  };

  const submitFeedback = obj => {
    console.log(obj);
    setLoading(true);
    fetch(submitfeedbackUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then(responseJson => {
        setVisibleSnackbar('Feedback sent successfully!');
        setLoading(false);
        setTimeout(function() {
          navigation.goBack();
        }, 1000);
      })
      .catch(error => {
        setVisibleSnackbar('Something went wrong!');
        console.error(error);
        setLoading(false);
      });
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={!!visibleSnackbar}
        onDismiss={() => setVisibleSnackbar('')}
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisibleSnackbar('');
          },
        }}
        style={{ backgroundColor: 'white' }}
        wrapperStyle={{ backgroundColor: 'white' }}>
        <Text style={{ color: 'black', fontSize: 16, letterSpacing: 1 }}>
          {visibleSnackbar}
        </Text>
      </Snackbar>
    );
  };

  const headerComponent = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: 20,
            marginBottom: 35,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name={'keyboard-backspace'} size={27} color={'grey'} />
          </TouchableOpacity>
          <View
            style={{ justifyContent: 'flex-end', flex: 0.9, marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                letterSpacing: 1,
                textAlign: 'center',
              }}>
              Share your feedback
            </Text>
          </View>
        </View>
        {/* <Text style={{ fontSize: 14, color: "grey", textAlign: "center" }}>Provide your feedback and help us serve you better.</Text> */}
      </View>
    );
  };

  const feedbackValue = value => {
    console.log(value);
    setFeedbackRating(value);
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{ padding: 30 }}>
        <View>
          {headerComponent()}
          <View style={{ marginVertical: 45 }}>
            <EmojiRating feedbackValue={value => feedbackValue(value)} />
          </View>
          {descriptionComponent()}
        </View>
        <PageSpinner visible={loading} />
      </ScrollView>
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    // padding: 30,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  loginButton: {
    alignSelf: 'center',
    marginVertical: 35,
    width: 180,
    borderRadius: 20,
  },
  userImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
