import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../common';
import ProgressiveImage from '../ProgressiveImage';
import InnerShadow from '../InnerShadow';
import { getW185ImageUrl, getW1280ImageUrl } from '../../api/urls';
import Theme from '../../Theme';

class SkillBackdropWithTitle extends React.PureComponent {
  render() {
    const { skill } = this.props;

    return (
      <View>
        <ProgressiveImage
          resizeMode="cover"
          style={styles.image}
          source={{ uri: getW1280ImageUrl(skill.backdrop_path) }}
          thumbnailSource={{ uri: getW185ImageUrl(skill.backdrop_path) }}
        />
        <InnerShadow hexColor={Theme.colors.background} startOpacity={1} size={140} bottom />
        <View style={styles.titleWrapper}>
          <AppText type="title2">{skill.title}</AppText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '110%',
    aspectRatio: Theme.specifications.backdropAspectRation,
    backgroundColor: Theme.colors.transparentBlack
  },
  titleWrapper: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny
  }
});

SkillBackdropWithTitle.propTypes = {
  skill: PropTypes.object.isRequired
};

export default SkillBackdropWithTitle;
