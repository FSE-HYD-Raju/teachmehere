import React, { Fragment } from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Theme from '../../../Theme';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  onforgotPasswordPressed,
  forgotPasswordSelector,
  setForgotPasswordFormObj,
} from '../../../redux/slices/forgotPasswordSlice';
import PageSpinner from '../../../components/common/PageSpinner';
import * as yup from 'yup';
import { Formik } from 'formik';

export default function forgotPasswordPage({ navigation }) {
  const dispatch = useDispatch();
  const { loading, loginEmailError } = useSelector(forgotPasswordSelector);

  const headerComponent = () => {
    return (
      <View>
        <View style={styles.backgroundText}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          <Image
            style={styles.backgroundImage}
            resizeMode={'stretch'}
            source={require('../../../assets/img/chatroom1.png')}
          />
          <Text
            style={{
              color: 'rgb(186,186,186)',
              fontSize: 15,
              textAlign: 'center',
            }}>
            Enter your registered email id to receive verification code
          </Text>
        </View>
      </View>
    );
  };

  const footerComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text>Remember password?</Text>
        <Button
          title="Sign in"
          type="clear"
          containerStyle={styles.register}
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  };

  const inputContainer = () => {
    const verifyClicked = values => {
      dispatch(
        onforgotPasswordPressed({
          email: values.Email,
          onSuccess: () => {
            dispatch(setForgotPasswordFormObj({ Email: values.Email }));
            navigation.navigate('ForgotPasswordOTP');
          },
        }),
      );
    };
    return (
      <Formik
        initialValues={{ Email: '' }}
        onSubmit={values => verifyClicked(values)}
        validationSchema={yup.object().shape({
          Email: yup
            .string()
            .email()
            .required(),
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
            <View style={styles.inputComponentStyle}>
              <Input
                style={{ paddingLeft: 2 }}
                placeholder="Email"
                leftIcon={{ type: 'Feather', name: 'mail', size: 20 }}
                errorMessage={loginEmailError}
                containerStyle={{ width: 310 }}
                leftIconContainerStyle={{ paddingRight: 15 }}
                inputStyle={{ fontSize: 16 }}
                value={values.Email}
                onChangeText={e => {
                  handleChange('Email')(e);
                  dispatch(clearErrors());
                }}
                onBlur={() => setFieldTouched('Email')}
              />
              {touched.Email && errors.Email && (
                <Text
                  style={{
                    fontSize: 12,
                    color: 'red',
                    textAlign: 'center',
                    marginTop: -15,
                  }}>
                  {errors.Email}
                </Text>
              )}
              <Button
                title="Send"
                disabled={!isValid}
                type="solid"
                containerStyle={styles.loginButton}
                onPress={handleSubmit}
              />
              <PageSpinner visible={loading} />
            </View>
          </Fragment>
        )}
      </Formik>
    );
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {headerComponent()}
        {inputContainer()}
        {footerComponent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 25,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  forgotPasswordText: {
    // fontWeight: 'bold',
    fontSize: 25,
    marginTop: 30,
    letterSpacing: 1,
  },
  backgroundText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    marginTop: 5,
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  inputComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
  },
  MainContainer: {
    padding: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  loginButton: {
    alignSelf: 'center',
    marginVertical: Theme.spacing.small,
    width: '50%',
    borderRadius: 20,
  },
});
