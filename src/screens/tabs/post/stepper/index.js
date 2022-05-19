import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { BackHandler } from 'react-native';

const defaultInOnNext = '';
const defaultOutOnNext = '';
const defaultInOnBack = '';
const defaultOutOnBack = '';

export class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      totalSteps: 0,
      userState: {},
      action: '',
      animationFinished: false,
    };
  }

  componentWillMount() {
    const { comeInOnNext = defaultInOnNext } = this.props;
    this.setState({ action: comeInOnNext });
    this.updateEditedValues();
  }

  componentDidMount() {
    const { steps = 0 } = this.props;
    this.setState({ totalSteps: steps.length - 1 });
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.back();
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  updateEditedValues = () => {
    if (!this.props.editingSkill) return;
    const {
      coursename,
      courselevel,
      content,
      category,
      subCategory,
      totalhours,
      country,
      currency,
      price,
      speakinglanguages,
      availability,
      platform,
      tags,
      experience,
      profilesummary,
      linkedinprofile,
      demo,
      _id,
    } = this.props.editingSkill || {};
    console.log('this.props.editingSkill', this.props.editingSkill);
    const enteredValues = {
      skillName: coursename,
      skillLevel: courselevel,
      contents: content || [],
      category: category,
      subcategory: subCategory,
      totalHours: totalhours.toString(),
      country: { name: country, currency: { symbol: currency } },
      individualPrice: price.oneonone.toString(),
      noOfPeople: price.group.members ? price.group.members.toString() : null,
      groupPrice: price.group.price ? price.group.price.toString() : null,
      isGroupSelected: price.group.price ? true : false,
      languages: [...speakinglanguages],
      startDate: availability.coursestartdate,
      endDate: availability.courseenddate,
      onDays: availability.ondays.availableon,
      daysofweek: availability.ondays.daysofweek,
      startTime: availability.coursestarttime,
      endTime: availability.coursesendtime,
      isTentativeSchedule: availability.tentativeschedule,
      platform: platform,
      tags: tags.join(','),
      experience: experience.toString(),
      profileSummary: profilesummary,
      linkedInProfile: linkedinprofile,
      availableForDemo: demo,
      _id,
    };

    console.log(enteredValues);

    this.setState({ userState: { ...enteredValues } });
  };

  next = () => {
    const { currentStep, totalSteps } = this.state;
    const {
      animate = true,
      OutOnNext = defaultOutOnNext,
      duration = 100,
    } = this.props;
    if (currentStep !== totalSteps) {
      this.onNext();
      this.setState({ action: OutOnNext, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({
            currentStep: currentStep + 1,
          });
        }, duration);
      }
    } else {
      this.finish();
    }
  };

  back = () => {
    const { currentStep } = this.state;
    const {
      animate = true,
      OutOnBack = defaultOutOnBack,
      duration = 100,
    } = this.props;
    if (currentStep !== 0) {
      this.onBack();
      this.setState({ action: OutOnBack, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({ currentStep: currentStep - 1 });
        }, duration);
      }
    } else {
      this.props.backFromSteps();
    }
  };

  onNext = () => {
    const { onNext } = this.props;
    if (onNext) {
      if (typeof onNext != 'function') {
        throw new Error('onNext parameter should be a function');
      }
      onNext();
    }
  };

  onBack = () => {
    const { onBack } = this.props;
    if (onBack) {
      if (typeof onBack != 'function') {
        throw new Error('onBack parameter should be a function');
      }
      onBack();
    }
  };

  finish = () => {
    const { onFinish } = this.props;
    const { userState } = this.state;
    if (onFinish) {
      onFinish(userState);
    }
  };

  saveState = state => {
    const { userState } = this.state;
    if (typeof state !== 'object') {
      throw new Error('State must be an object');
    }
    this.setState({ userState: { ...userState, ...state } });
  };

  getState = () => {
    return this.state.userState;
  };

  getCurrentStep = () => {
    const { currentStep } = this.state;
    return currentStep + 1;
  };

  getTotalSteps = () => {
    const { totalSteps } = this.state;
    return totalSteps + 1;
  };

  animationEnd = () => {
    const { action, animationFinished } = this.state;
    const {
      OutOnBack = defaultOutOnBack,
      comeInOnBack = defaultInOnBack,
      comeInOnNext = defaultInOnNext,
    } = this.props;
    if (!animationFinished) {
      this.setState({
        action: action == OutOnBack ? comeInOnBack : comeInOnNext,
        animationFinished: true,
      });
    }
  };

  render() {
    const { steps = 0, duration = 100 } = this.props;
    const { currentStep, action } = this.state;
    const Step = steps[currentStep].component;
    return (
      <Animatable.View
        ref={this.handleViewRef}
        animation={action}
        onAnimationEnd={this.animationEnd}
        style={{ flex: 1 }}
        duration={duration}>
        <Step
          next={this.next}
          back={this.back}
          saveState={this.saveState}
          getState={this.getState}
          getCurrentStep={this.getCurrentStep}
          getTotalSteps={this.getTotalSteps}
          backFromSteps={this.props.backFromSteps}
          userState={this.state.userState}
        />
      </Animatable.View>
    );
  }
}

export default Animatable.createAnimatableComponent(index);
