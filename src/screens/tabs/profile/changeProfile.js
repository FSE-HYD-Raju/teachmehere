import React, { Fragment } from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements';
import Theme from '../../../Theme';
import IconMaterialIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeProfileSelector,
  clearPasswordErrors,
  onChangePasswordPressed,
  onChangeProfilePressed,
} from '../../../redux/slices/changeProfileSlice';
import { loginSelector, loadUserInfo } from '../../../redux/slices/loginSlice';
import PageSpinner from '../../../components/common/PageSpinner';
// import ImagePicker from 'react-native-image-picker';
import * as yup from 'yup';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChangeProfilePage({ navigation }) {
  const dispatch = useDispatch();
  const {
    loading,
    changeProfileUsernameError,
    DescriptionError,
    oldPasswordError,
    newPasswordError,
  } = useSelector(changeProfileSelector);
  const { userInfo } = useSelector(loginSelector);
  const [hidePassword, sethidePassword] = React.useState(true);
  const [hidePassword2, sethidePassword2] = React.useState(true);
  const [eyeicon, seteyeicon] = React.useState('eye');
  const [eyeicon2, seteyeicon2] = React.useState('eye');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const buttons = ['Edit Profile', 'Update Password'];

  const toggleEyeIcon = () => {
    if (eyeicon === 'eye') {
      seteyeicon('eye-off');
      sethidePassword(false);
    } else {
      seteyeicon('eye');
      sethidePassword(true);
    }
  };

  const toggleEyeIcon2 = () => {
    if (eyeicon2 === 'eye') {
      seteyeicon2('eye-off');
      sethidePassword2(false);
    } else {
      seteyeicon2('eye');
      sethidePassword2(true);
    }
  };

  const editProfileComponent = () => {
    const editProfileSubmit = values => {
      dispatch(
        onChangeProfilePressed({
          id: userInfo._id,
          username: values.Username,
          description: values.Description,
          displaypic: userInfo.displaypic,
          onSuccess: data => {
            dispatch(loadUserInfo(data));
            navigation.navigate('Profile');
          },
        }),
      );
    };
    return (
      <Formik
        initialValues={{
          Username: userInfo.username,
          Description: userInfo.description,
        }}
        onSubmit={values => editProfileSubmit(values)}
        validationSchema={yup.object().shape({
          Username: yup
            .string()
            .min(3)
            .required(),
          Description: yup.string().min(10),
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
              <InputComponent
                placeholder="Username"
                fieldName="Username"
                leftIcon={<IconMaterialIcons name="user" size={20} />}
                errorMessage={changeProfileUsernameError}
                value={values.Username}
                touched={touched.Username}
                errors={errors.Username}
                handleChange={handleChange}
                setFieldTouched={setFieldTouched}
              />

              <InputComponent
                placeholder="Description"
                fieldName="Description"
                leftIcon={<IconMaterialIcons name="edit" size={20} />}
                errorMessage={DescriptionError}
                value={values.Description}
                touched={touched.Description}
                errors={errors.Description}
                handleChange={handleChange}
                setFieldTouched={setFieldTouched}
              />
            </View>
            <Button
              title="Update"
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
            dispatch(clearPasswordErrors());
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

  const changePasswordComponent = () => {
    const changePasswordSubmit = values => {
      dispatch(
        onChangePasswordPressed({
          id: userInfo._id,
          oldpassword: values.Oldpassword,
          newpassword: values.Newpassword,
          onSuccess: () => {
            navigation.navigate('Profile');
          },
        }),
      );
    };
    return (
      <Formik
        initialValues={{ Oldpassword: '', Newpassword: '' }}
        onSubmit={values => changePasswordSubmit(values)}
        validationSchema={yup.object().shape({
          Oldpassword: yup
            .string()
            .min(5)
            .required(),
          Newpassword: yup
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
              <InputComponent
                placeholder="Current Password"
                fieldName="Oldpassword"
                leftIcon={<IconMaterialIcons name="lock" size={20} />}
                errorMessage={oldPasswordError}
                value={values.Oldpassword}
                touched={touched.Oldpassword}
                // errors={errors.Oldpassword}
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

              <InputComponent
                placeholder="New Password"
                fieldName="Newpassword"
                leftIcon={<IconMaterialIcons name="lock" size={20} />}
                errorMessage={newPasswordError}
                value={values.Newpassword}
                touched={touched.Newpassword}
                errors={errors.Newpassword}
                handleChange={handleChange}
                setFieldTouched={setFieldTouched}
                rightIcon={
                  <IconMaterialIcons
                    name={eyeicon2}
                    size={20}
                    margin="10"
                    onPress={toggleEyeIcon2}
                  />
                }
                secureTextEntry={hidePassword2}
              />
            </View>
            <Button
              title="Update"
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

  const headerComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: 20,
          marginBottom: 10,
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
            Update Profile
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
            source={require('../../../assets/img/changeprofile.png')}
          />
        </View>
        {/* <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    <Text style={{ color: 'gray', fontSize: 15, textAlign: "center", letterSpacing: 0 }} >Please enter the OTP sent to your email </Text>
                </View> */}
      </View>
    );
  };

  const bodyComponent = () => {
    return (
      <View>
        <View style={{ marginTop: 30 }}>
          <ButtonGroup
            onPress={index => setSelectedIndex(index)}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ height: 40, borderRadius: 20 }}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          {selectedIndex == 0 && editProfileComponent()}
          {selectedIndex == 1 && changePasswordComponent()}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {headerComponent()}
        {imageContainer()}
        {bodyComponent()}
        <PageSpinner visible={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerComponentText: {
    fontWeight: 'bold',
    fontSize: 25,
    letterSpacing: 1,
    marginBottom: 20,
  },
  inputComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  MainContainer: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 30,
  },
  loginButton: {
    alignSelf: 'center',
    marginVertical: Theme.spacing.small,
    width: '50%',
    borderRadius: 20,
  },
  forgotButton: {
    paddingVertical: Theme.spacing.tiny,
    marginLeft: 2,
  },
  register: {
    paddingVertical: Theme.spacing.tiny,
    marginLeft: 7,
  },
  userImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: 200,
    height: 200,
  },
});
