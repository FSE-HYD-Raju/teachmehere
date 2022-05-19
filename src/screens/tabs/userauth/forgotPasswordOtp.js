import React, { Fragment, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Theme from '../../../Theme';
import IconMaterialIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  onOtpPressed,
  forgotPasswordSelector,
  onforgotPasswordPressed,
} from '../../../redux/slices/forgotPasswordSlice';
import PageSpinner from '../../../components/common/PageSpinner';
import * as yup from 'yup';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { storeAsyncData } from '../../../components/common/asyncStorage';
import { loadUserInfo } from '../../../redux/slices/loginSlice';
import { Snackbar } from 'react-native-paper';

export default function forgotPasswordOtpPage({ navigation }) {
  const dispatch = useDispatch();
  const {
    loading,
    loginOtpError,
    loginPasswordError,
    forgotPasswordFormObj,
  } = useSelector(forgotPasswordSelector);

  const [hidePassword, sethidePassword] = React.useState(true);
  const [eyeicon, seteyeicon] = React.useState('eye');
  const [resendtimer, setResendtimer] = React.useState(5);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);

  useEffect(() => {
    let interval = null;
    if (resendtimer !== 0) {
      interval = setInterval(() => {
        setResendtimer(resendtimer => resendtimer - 1);
      }, 1000);
    } else if (!resendtimer) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendtimer]);

  const toggleEyeIcon = () => {
    if (eyeicon === 'eye') {
      seteyeicon('eye-off');
      sethidePassword(false);
    } else {
      seteyeicon('eye');
      sethidePassword(true);
    }
  };

  const headerComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: 20,
          marginBottom: 5,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name={'keyboard-backspace'} size={27} color={'grey'} />
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-end', flex: 0.9, marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 20,
              color: 'grey',
              letterSpacing: 1,
              textAlign: 'center',
            }}>
            Veirfy Account
          </Text>
        </View>
      </View>
    );
  };

  const imageContainer = () => {
    return (
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.backgroundImage}
            resizeMode={'stretch'}
            source={require('../../../assets/img/otpscreen.png')}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'gray',
              fontSize: 15,
              textAlign: 'center',
              letterSpacing: 0,
            }}>
            Please enter the OTP sent to your email{' '}
            {forgotPasswordFormObj.Email}
          </Text>
        </View>
      </View>
    );
  };

  const resendOTP = () => {
    dispatch(
      onforgotPasswordPressed({
        email: forgotPasswordFormObj.Email,
        onSuccess: () => {
          setVisibleSnackbar(true);
          setResendtimer(5);
        },
      }),
    );
  };

  const footerComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          //   marginBottom: 30,
        }}>
        <Text>If you didn't receive a code!</Text>
        {!resendtimer && (
          <Button
            title="Resend"
            type="clear"
            containerStyle={styles.register}
            onPress={() => resendOTP()}
          />
        )}
        {!!resendtimer && (
          <Button
            title={resendtimer + ' secs'}
            type="clear"
            containerStyle={styles.register}
            disabled
          />
        )}
      </View>
    );
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisibleSnackbar(false);
          },
        }}
        style={{ backgroundColor: 'white' }}
        wrapperStyle={{ backgroundColor: 'white' }}>
        <Text style={{ color: 'black', fontSize: 16, letterSpacing: 1 }}>
          {' '}
          OTP sent succesfully
        </Text>
      </Snackbar>
    );
  };

  const inputContainer = () => {
    const submitClicked = values => {
      dispatch(
        onOtpPressed({
          otp: values.OTP,
          password: values.Password,
          email: forgotPasswordFormObj.Email,
          onSuccess: data => {
            dispatch(loadUserInfo(data));
            storeAsyncData('userInfo', data);
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'BottomNav' }],
            // });
            navigation.popToTop();
          },
        }),
      );
    };
    return (
      <Formik
        initialValues={{ OTP: '', Password: '' }}
        onSubmit={values => submitClicked(values)}
        validationSchema={yup.object().shape({
          OTP: yup.number().required(),
          Password: yup
            .string()
            .min(5)
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
                style={{ paddingLeft: 20 }}
                placeholder="OTP"
                leftIcon={<IconMaterialIcons name="key" size={20} />}
                errorMessage={loginOtpError}
                containerStyle={{ width: 310 }}
                leftIconContainerStyle={{ paddingRight: 15 }}
                inputStyle={{ fontSize: 16 }}
                value={values.OTP}
                onBlur={() => setFieldTouched('OTP')}
                onChangeText={e => {
                  handleChange('OTP')(e);
                  dispatch(clearErrors());
                }}
              />
              {touched.OTP && errors.OTP && (
                <Text
                  style={{
                    fontSize: 12,
                    color: 'red',
                    textAlign: 'center',
                    marginTop: -15,
                  }}>
                  {errors.OTP}
                </Text>
              )}
              <Input
                placeholder="New Password"
                secureTextEntry={hidePassword}
                leftIcon={<IconMaterialIcons name="lock" size={20} />}
                rightIcon={
                  <IconMaterialIcons
                    name={eyeicon}
                    size={20}
                    margin="10"
                    onPress={toggleEyeIcon}
                  />
                }
                onChangeText={e => {
                  handleChange('Password')(e);
                  dispatch(clearErrors());
                }}
                containerStyle={{ width: 310 }}
                leftIconContainerStyle={{ paddingRight: 15 }}
                inputStyle={{ fontSize: 16 }}
                onBlur={() => setFieldTouched('Password')}
                errorMessage={loginPasswordError}
              />
              {touched.Password && errors.Password && (
                <Text
                  style={{
                    fontSize: 12,
                    color: 'red',
                    textAlign: 'center',
                    marginTop: -15,
                  }}>
                  {errors.Password}
                </Text>
              )}
              <Button
                title="Submit"
                disabled={!isValid}
                type="solid"
                containerStyle={styles.loginButton}
                onPress={handleSubmit}
              />
            </View>
          </Fragment>
        )}
      </Formik>
    );
  };

  return (
    <View style={styles.MainContainer}>
      {headerComponent()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{}}>
        {imageContainer()}
        {inputContainer()}
        {footerComponent()}
        <PageSpinner visible={loading} />
      </ScrollView>
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    marginTop: 5,
    width: 200,
    height: 200,
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
    paddingBottom: 0,
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
