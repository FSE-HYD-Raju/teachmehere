import React, { Fragment, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Theme from '../../../Theme';
import IconMaterialIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  onSignupPressed,
  signupSelector,
  setSignupFormObj,
} from '../../../redux/slices/signupSlice';
import * as yup from 'yup';
import { Formik } from 'formik';
import PageSpinner from '../../../components/common/PageSpinner';

export default function signupFormPage({ navigation }) {
  const dispatch = useDispatch();
  const {
    loading,
    signupPasswordError,
    signupEmailError,
    signupPhonenumberError,
    signupUsernameError,
  } = useSelector(signupSelector);
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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
          marginBottom: 50,
        }}>
        <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 15 }}>
          Sign up
        </Text>
        <Text style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
          OTP will be sent to your email
        </Text>
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
          marginTop: 10,
        }}>
        <Text>Already have an account?</Text>
        <Button
          title="Sign in"
          type="clear"
          containerStyle={styles.signin}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );
  };

  const InputComponent = props => {
    return (
      <View>
        <Input
          style={{ paddingLeft: 20 }}
          placeholder={props.placeholder}
          leftIcon={props.leftIcon}
          containerStyle={{ width: 310 }}
          leftIconContainerStyle={{ paddingRight: 15 }}
          inputStyle={{ fontSize: 16 }}
          errorMessage={props.errorMessage}
          value={props.value}
          onChangeText={e => {
            props.handleChange(props.fieldName)(e);
            dispatch(clearErrors());
          }}
          onBlur={() => props.setFieldTouched(props.fieldName)}
          secureTextEntry={props.secureTextEntry ? props.secureTextEntry : null}
          rightIcon={props.rightIcon ? props.rightIcon : null}
        />

        {props.touched && props.errors && (
          <Text
            style={{
              fontSize: 12,
              color: 'red',
              textAlign: 'center',
              marginTop: -15,
            }}>
            {props.errors}
          </Text>
        )}
      </View>
    );
  };

  const inputFields = () => {
    return ({
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
          <InputComponent
            placeholder="Username"
            fieldName="Username"
            leftIcon={<IconMaterialIcons name="user" size={20} />}
            errorMessage={signupUsernameError}
            value={values.Username}
            touched={touched.Username}
            errors={errors.Username}
            handleChange={handleChange}
            setFieldTouched={setFieldTouched}
          />

          <InputComponent
            placeholder="Email"
            fieldName="Email"
            leftIcon={{ type: 'Feather', name: 'mail', size: 20 }}
            errorMessage={signupEmailError}
            value={values.Email}
            touched={touched.Email}
            errors={errors.Email}
            handleChange={handleChange}
            setFieldTouched={setFieldTouched}
          />

          <InputComponent
            placeholder="Phone Number"
            fieldName="Phonenumber"
            leftIcon={<IconMaterialIcons name="phone" size={20} />}
            errorMessage={signupPhonenumberError}
            value={values.Phonenumber}
            touched={touched.Phonenumber}
            errors={errors.Phonenumber}
            handleChange={handleChange}
            setFieldTouched={setFieldTouched}
          />

          <InputComponent
            placeholder="Password"
            fieldName="Password"
            leftIcon={<IconMaterialIcons name="lock" size={20} />}
            errorMessage={signupPasswordError}
            value={values.Password}
            touched={touched.Password}
            errors={errors.Password}
            handleChange={handleChange}
            setFieldTouched={setFieldTouched}
            rightIcon={
              <IconMaterialIcons
                name={eyeicon}
                size={20}
                margin="10"
                onPress={toggleEyeIcon}
              />
            }
            secureTextEntry={hidePassword}
          />

          <Button
            title="Sign up"
            disabled={!isValid}
            type="solid"
            containerStyle={styles.loginButton}
            onPress={handleSubmit}
          />
        </View>
      </Fragment>
    );
  };

  const onSignupSubmit = values => {
    dispatch(
      setSignupFormObj({
        Email: values.Email,
        Password: values.Password,
      }),
    );
    dispatch(
      onSignupPressed({
        email: values.Email,
        username: values.Username,
        phonenumber: values.Phonenumber,
        onSuccess: () => {
          navigation.navigate('SignupOtp');
        },
      }),
    );
  };

  const validationSchemaObj = {
    Email: yup
      .string()
      .email()
      .required(),
    Phonenumber: yup.number().required(),
    Username: yup
      .string()
      .min(3)
      .required(),
    Password: yup
      .string()
      .min(5)
      .required(),
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {headerComponent()}
          <Formik
            initialValues={{
              Email: '',
              Username: '',
              Phonenumber: '',
              Password: '',
            }}
            onSubmit={values => onSignupSubmit(values)}
            validationSchema={yup.object().shape(validationSchemaObj)}>
            {inputFields()}
          </Formik>
          {footerComponent()}
        </View>
        <PageSpinner visible={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  signin: {
    paddingVertical: Theme.spacing.tiny,
    // paddingRight: Theme.spacing.small,
    marginLeft: 7,
  },
  inputComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30
  },
  loginButton: {
    alignSelf: 'center',
    marginVertical: Theme.spacing.small,
    width: 150,
    borderRadius: 20,
  },
  MainContainer: {
    flex: 1,
    // padding: 30,
    backgroundColor: 'rgb(255, 255, 255)',
  },
});
