import { StyleSheet, Dimensions } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
export default StyleSheet.create({
  btnLabelStyle: {
    textTransform: 'capitalize',
    fontSize: 15,
    fontWeight: 'bold',
  },
  container: {
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    flex: 1,
    height: 47,
  },
  inputTextArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    flex: 1,
  },
  label: {
    fontSize: 12,
    padding: 5,
    color: '#777',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    color: 'crimson',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    fontSize: 15,
    color: 'black',
  },
  btnStyle: {
    width: '100%',
  },
  btnImage: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    transform: [{ rotate: '180deg' }],
  },
  marginAround: {
    width: '40%',
    justifyContent: 'space-between',
  },
  currentStepText: {
    color: '#444',
    fontSize: 22,
    fontWeight: 'bold',
  },
  datePicker: {
    flex: 1,
    alignItems: 'center',
    marginTop: '6%',
    backgroundColor: '#FFFFFF',
  },

  surface: {
    margin: 10,
    elevation: 4,
  },
  inputDate: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#4444',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 0,
  },
  textWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
    left: 10,
  },
  column: {
    // width: screenWidth - 70,
    // padding: 5,
    flexDirection: 'row',
    // alignItems: 'flex-start',
    backgroundColor: '#eff0f1',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
    padding: 10,
    paddingVertical: 4,
    paddingLeft: 10,
    borderRadius: 10,
  },
  row: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    // flexWrap: 'wrap',
  },
  bullet: {
    // width: 10,
    // marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    // width: 280,
    // paddingTop: 5,
    // paddingLeft: 5,
  },
  removeContent: {
    // marginLeft: 15,
    // marginTop: 7,
  },
  platform: {
    marginTop: 15,
    marginBottom: 10,
    width: 90,
    backgroundColor: 'rgba(152,73,166,0.1)',
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 3,
    borderRadius: 2,
  },
  platformText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(152,73,166,1)',
  },
  usersRated: {
    fontSize: 12,
    color: '#444',
    padding: 3,
    marginTop: 1,
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    margin: 27,
  },
  heading: {
    color: '#444',
    fontSize: 20,
    padding: 25,
    textAlign: 'center',
  },
});
