import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import IconMaterialIcons from 'react-native-vector-icons/Feather';

export default function GuestPage({ navigation }) {
  const settingsIconContainer = () => {
    return (
      <View style={{ alignItems: 'flex-end', width: '100%' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileSettings')}
          style={styles.settingsIconContainer}>
          <IconMaterialIcons
            name={'settings'}
            color="rgb(102, 94, 94)"
            size={25}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const imageContainer = () => {
    return (
      <View style={styles.centerAligned}>
        <Image
          resizeMode={'stretch'}
          style={styles.backgroundImage}
          source={require('../../../assets/img/guest.png')}
        />
      </View>
    );
  };

  const textContainer = () => {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.textHeader}>Share Your Skills Online</Text>
        <Text style={styles.text}>
          Share skills while earning money or learn from the professionals
          within your budget
          {/* Online teaching and learning made easily, share your */}
        </Text>
      </View>
    );
  };

  const buttonContainer = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Button
          containerStyle={{ width: 200 }}
          onPress={() => navigation.navigate('Login')}
          titleStyle={{ color: 'rgb(20, 169, 201)' }}
          buttonStyle={{ borderColor: 'rgb(63, 204, 222)' }}
          title="Sign in"
          type="outline"
        />
        <Button
          containerStyle={{ width: 200, marginTop: 20 }}
          onPress={() => navigation.navigate('Signup')}
          titleStyle={{ color: 'rgb(63, 204, 222)', fontSize: 16 }}
          buttonStyle={{ borderColor: 'rgb(63, 204, 222)' }}
          title="Sign up"
          type="clear"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {settingsIconContainer()}
          {imageContainer()}
          {textContainer()}
          {buttonContainer()}
        </View>
      </ScrollView>
    </View>
  );
}

// const win = Dimensions.get('window');
// const ratio = win.width / 4000;

const styles = StyleSheet.create({
  settingsIconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 35,
    marginRight: 30,
    elevation: 10,
  },
  text: {
    color: 'gray',
    fontSize: 14,
    margin: 5,
    textAlign: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
    textAlign: 'center',
  },
  backgroundImage: {
    width: 360,
    height: 275,
    marginTop: -20,
    // flex: 1,
    // width: win.width,
    // height: 3000 * ratio, //362 is actual height of image
  },
  centerAligned: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
});
