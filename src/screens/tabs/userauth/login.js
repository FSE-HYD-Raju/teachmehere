import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Theme from '../../../Theme';
import IconMaterialIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSelector,
  clearErrors,
  onLoginPressed,
} from '../../../redux/slices/loginSlice';
import PageSpinner from '../../../components/common/PageSpinner';
import * as yup from 'yup';
import { Formik } from 'formik';
import { postSelector } from '../../../redux/slices/post';

export default function LoginPage({ navigation }) {
  const dispatch = useDispatch();

  const {
    profileLoading,
    loginPasswordError,
    loginEmailError,
    loginEmail,
  } = useSelector(loginSelector);
  const { isPostQueryActive } = useSelector(postSelector);
  const [hidePassword, sethidePassword] = React.useState(true);
  const [eyeicon, seteyeicon] = React.useState('eye');

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
      <View style={styles.headerComponent}>
        {/* <Text style={styles.headerComponentText}>Welcome Back!</Text> */}
        <Image
          style={styles.backgroundImage}
          resizeMode={'stretch'}
          source={require('../../../assets/img/login.png')}
        />
      </View>
    );
  };

  const inputComponent = () => {
    const onSigninClicked = values => {
      dispatch(
        onLoginPressed({
          email: values.Email,
          password: values.Password,
          onSuccess: () => {
            if (isPostQueryActive) {
              navigation.navigate('PostPage');
            } else {
              console.log('suchiiiiii');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Profile' }],
              });
            }
          },
        }),
      );
    };
    return (
      <Formik
        initialValues={{ Email: loginEmail, Password: '' }}
        onSubmit={values => {
          onSigninClicked(values);
        }}
        validationSchema={yup.object().shape({
          Email: yup
            .string()
            .email()
            .required(),
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
                placeholder="Email"
                leftIcon={{ type: 'Feather', name: 'mail', size: 20 }}
                errorMessage={loginEmailError}
                value={values.Email}
                onChangeText={e => {
                  handleChange('Email')(e);
                  dispatch(clearErrors());
                }}
                containerStyle={{ width: 310 }}
                inputStyle={{ fontSize: 16 }}
                leftIconContainerStyle={{ paddingRight: 15 }}
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
              <Input
                placeholder="Password"
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
                inputStyle={{ fontSize: 16 }}
                errorMessage={loginPasswordError}
                value={values.Password}
                containerStyle={{ width: 310 }}
                leftIconContainerStyle={{ paddingRight: 15 }}
                onChangeText={e => {
                  handleChange('Password')(e);
                  dispatch(clearErrors());
                }}
                onBlur={() => setFieldTouched('Password')}
              />
              {touched.Password && errors.Password && (
                <Text
                  style={{
                    fontSize: 12,
                    color: 'red',
                    textAlign: 'center',
                    marginTop: -15,
                  }}>
                  {errors.Password && !loginPasswordError}
                </Text>
              )}
            </View>
            <Button
              title="Sign in"
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

  const buttonComponent = () => {
    return (
      <View>
        <Button
          title="Forgot password?"
          type="clear"
          containerStyle={styles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text>Don't have an account?</Text>
          <Button
            title="Register"
            type="clear"
            containerStyle={styles.register}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {headerComponent()}
        {inputComponent()}
        {buttonComponent()}
        <PageSpinner visible={profileLoading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerComponentText: {
    fontSize: 25,
    letterSpacing: 1,
    marginBottom: 20,
  },
  inputComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  backgroundImage: {
    width: 320,
    height: 260,
    marginBottom: 30,
  },
  MainContainer: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    // padding: 30,
  },
  loginButton: {
    alignSelf: 'center',
    marginVertical: Theme.spacing.small,
    width: 150,
    borderRadius: 20,
  },
  forgotButton: {
    marginLeft: 2,
  },
  register: {
    marginLeft: 7,
  },
});
