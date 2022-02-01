import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedMultistep from '../stepper';

import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

import {
  fetchPost,
  postSelector,
  postNewSkill,
  postSkill,
  postLoading,
  updateSkill,
} from '../../../../redux/slices/post';
import { loginSelector } from '../../../../redux/slices/loginSlice';

const allSteps = [
  { name: 'step 1', component: Step1 },
  { name: 'step 2', component: Step2 },
  { name: 'step 3', component: Step3 },
  { name: 'step 4', component: Step4 },
];

const Steps = props => {
  const dispatch = useDispatch();
  const { postResponse, isPostQueryActive, hasErrors } = useSelector(
    postSelector,
  );
  const [visibleSnackbar, setVisibleSnackbar] = React.useState('');

  const { userInfo } = useSelector(loginSelector);
  const onNext = () => {
    console.log('Next');
  };
  const onBack = () => {
    console.log('Back');
  };

  const finish = state => {
    const { category, subCategory } = props || {};
    const {
      skillName,
      skillLevel,
      contents,
      totalHours,
      country,
      individualPrice,
      groupPrice,
      noOfPeople,
      languages,
      startDate,
      endDate,
      startTime,
      endTime,
      onDays,
      daysofweek,
      isTentativeSchedule,
      platform,
      tags,
      experience,
      profileSummary,
      linkedInProfile,
      availableForDemo,
    } = state;
    dispatch(postSkill());
    if (userInfo._id) {
      dispatch(postLoading());
      const postData = {
        uid: userInfo._id,
        coursename: skillName,
        courselevel: skillLevel,
        content: contents || [],
        category: category,
        subcategory: subCategory,
        totalhours: parseInt(totalHours),
        country: country && country.name,
        currency: country && country.currency && country.currency.symbol,
        price: {
          oneonone: parseInt(individualPrice),
          group: {
            members: parseInt(noOfPeople) || 0,
            price: parseInt(groupPrice) || 0,
          },
        },
        speakinglanguages: languages,
        availability: {
          coursestartdate: startDate || '',
          courseenddate: endDate || '',
          ondays: {
            availableon: onDays || '',
            daysofweek: daysofweek || [],
          },
          coursestarttime: startTime || '',
          coursesendtime: endTime || '',
          tentativeschedule: isTentativeSchedule,
        },
        platform: platform,
        tags: tags && tags.length > 0 ? tags.split(',') : [],
        experience: parseInt(experience) || 0,
        profilesummary: profileSummary,
        linkedinprofile: linkedInProfile,
        demo: availableForDemo,
      };
      console.log(postData, 'postData');

      if (state._id) {
        postData._id = state._id;
        dispatch(
          updateSkill({
            postData,
            onSuccess: () => {
              setVisibleSnackbar('Skill updated successfully!');
              // props.navigation.navigate('PostedCourses')
              // props.navigation.goBack()
              // props.navigation.navigate('Home')

              props.navigation.navigate('Profile', { screen: 'PostedCourses' });
            },
          }),
        );
        return;
      }
      dispatch(
        postNewSkill({
          postData,
          onSuccess: () => {
            setVisibleSnackbar('Skill posted successfully!');

            // props.navigation.reset({
            //   index: 1,
            //   routes: [{ name: 'PostedCourses' }],
            //   // actions: [
            //   //   props.navigation.navigate({ routeName: 'Profile' }),
            //   //   props.navigation.navigate({ routeName: 'PostedCourses' }),
            //   // ],
            // });
            props.goToMainCategories();

            props.navigation.navigate('Profile', { screen: 'PostedCourses' });

            // setTimeout(function () {
            //   props.goToMainCategories();
            // }, 1000);
            // props.navigation.navigate('PostedCourses');
          },
        }),
      );
    } else {
      props.navigation.navigate('Login');
    }
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

  return (
    <ScrollView>
      <AnimatedMultistep
        steps={allSteps}
        onFinish={finish}
        animate={true}
        onBack={onBack}
        onNext={onNext}
        backFromSteps={props.backFromSteps}
        editingSkill={props.editingSkill}
      />
      {snackComponent()}
    </ScrollView>
  );
};

export default Steps;
