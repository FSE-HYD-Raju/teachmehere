import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  List,
  Switch,
  Checkbox,
  Colors,
  FAB,
  TextInput,
} from 'react-native-paper';
import { Icon, Rating, colors } from 'react-native-elements';
import FeatherIcons from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumericInput from 'react-native-numeric-input';

export default function FilterPage({
  onFilterClose,
  applyFilter,
  clearFilter,
}) {
  const [filterObj, setFilterObj] = React.useState({});
  const [courseLevelObj, setCourseLevelObj] = React.useState({});
  const [courseDurationObj, setCourseDurationObj] = React.useState({});
  const [priceRangeObj, setPriceRangeObj] = React.useState({});
  const [demoObj, setDemoObj] = React.useState(false);
  const [currentlyAvailableObj, setCurrentlyAvailableObj] = React.useState(
    false,
  );
  const [minRatingObj, setMinRatingObj] = React.useState(0);
  const [courseDuartionexpanded, setCourseDuartionexpanded] = React.useState(
    true,
  );
  const [priceRangeexpanded, setPriceRangeexpanded] = React.useState(true);

  const headerComponent = () => {
    return (
      <View style={styles.headerComponent}>
        <Icon
          name={'close'}
          color="#fff"
          size={18}
          style={{ textAlign: 'left' }}
          onPress={onFilterClose}
        />
        <Text style={styles.headerTitle}>Filters</Text>
      </View>
      // <FAB
      //     style={styles.fab}
      //     small={true}
      //     icon="close"
      //     label="Filters"
      //     color="white"
      //     style={{ alignItems: "flex-start" }}

      //     disabled={disableApply()}
      //     // style={{ backgroundColor: disableApply() ? "" : "rgb(0, 150, 136)" }}
      //     onPress={buildFilterObj}
      // />
    );
  };

  const courseLevelItemComponent = level => {
    return (
      <TouchableOpacity
        style={styles.recentSearchsItem}
        onPress={() =>
          setCourseLevelObj({
            ...courseLevelObj,
            [level]: !courseLevelObj[level],
          })
        }>
        <View style={styles.courseLevelItemContainer}>
          <Text style={styles.courseLevelItemText}> {level}</Text>
          <Checkbox
            status={courseLevelObj[level] ? 'checked' : 'unchecked'}
            onPress={() =>
              setCourseLevelObj({
                ...courseLevelObj,
                [level]: !courseLevelObj[level],
              })
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  const courseLevelComponent = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 10, paddingLeft: 3 }}>
        <List.Accordion
          title="Skill Level"
          titleStyle={{ color: 'black', fontSize: 16 }}
          style={{ color: 'black' }}
          left={props => (
            <FeatherIcons
              color={Colors.black}
              size={17}
              name="bar-chart-2"
              style={{ margin: 0 }}
            />
          )}>
          <View style={{ paddingLeft: 62, marginRight: 30 }}>
            {courseLevelItemComponent('Basic')}
            {courseLevelItemComponent('Intermediate')}
            {courseLevelItemComponent('Advanced')}
          </View>
        </List.Accordion>
      </View>
    );
  };

  const filterTypeTitle = (icon, title) => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <IconMaterialIcons
          name={icon}
          size={25}
          style={{ paddingVertical: 5, paddingHorizontal: 15 }}
        />
        <Text style={{ marginTop: 5, fontSize: 17, letterSpacing: 1 }}>
          {' '}
          {title}
        </Text>
      </View>
    );
  };

  const NumberInputComponent = ({ title, value, changefun, minValue = 0 }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            paddingBottom: 10,
            fontSize: 16,
            color: '#rgb(79, 96, 56)',
          }}>
          {title}
        </Text>
        <NumericInput
          initValue={0}
          totalHeight={40}
          value={value}
          minValue={minValue}
          rounded
          onChange={value => {
            changefun(value);
            Keyboard.once();
          }}
        />
      </View>
    );
  };

  const courseDurationComponent = () => {
    return (
      // <View style={{ flexDirection: 'row', marginTop: 25, alignItems: "center", flexWrap: "wrap" }}>
      //     <IconMaterialIcons
      //         name={"timer"}
      //         size={18}
      //         style={{ paddingVertical: 5, paddingLeft: 10, paddingRight: 7 }}
      //     />
      //     <Text style={{ fontSize: 18, paddingRight: 0, width: 105 }}> {"Course Duration "} </Text>
      //     <View >
      //         <View style={{ flexDirection: 'row' }}>
      //             <View style={{ alignItems: "center", paddingRight: 10 }}>
      //                 <Text style={{ paddingBottom: 10, fontSize: 14, color: "#rgb(79, 96, 56)" }}>{"Min"}</Text>
      //                 <NumericInput
      //                     initValue={priceRangeObj.Min}
      //                     totalHeight={40}
      //                     totalWidth={110}
      //                     value={priceRangeObj.Min}
      //                     minValue={0}
      //                     rounded onChange={value => setPriceRangeObj({ ...priceRangeObj, Min: value })} />
      //             </View>
      //             <View style={{ alignItems: "center" }}>
      //                 <Text style={{ paddingBottom: 10, fontSize: 14, color: "#rgb(79, 96, 56)" }}>{"Max"}</Text>
      //                 <NumericInput
      //                     initValue={priceRangeObj.Max}
      //                     totalHeight={40}
      //                     totalWidth={110}
      //                     value={priceRangeObj.Max}
      //                     minValue={0}
      //                     rounded onChange={value => setPriceRangeObj({ ...priceRangeObj, Max: value })} />
      //             </View>
      //         </View>
      //     </View>
      // </View>
      <View style={{ justifyContent: 'center', marginTop: 10, paddingLeft: 3 }}>
        <List.Accordion
          title="Skill Duration"
          titleStyle={{ color: 'black', fontSize: 15 }}
          style={{ color: 'black' }}
          expanded={courseDuartionexpanded}
          onPress={() => setCourseDuartionexpanded(!courseDuartionexpanded)}
          left={props => (
            <IconMaterialIcons
              color={Colors.black}
              size={16}
              name="timer"
              style={{ margin: 0 }}
            />
          )}>
          <View style={styles.numericInputContainerView}>
            <View style={styles.numericInputContainer}>
              <View style={{ alignItems: 'center', paddingRight: 10 }}>
                <Text
                  style={{
                    paddingBottom: 10,
                    fontSize: 12,
                    color: '#rgb(79, 96, 56)',
                  }}>
                  {'Min Hours'}
                </Text>
                <NumericInput
                  step={1}
                  valueType="real"
                  type="up-down"
                  initValue={courseDurationObj.Min}
                  totalHeight={40}
                  totalWidth={110}
                  value={courseDurationObj.Min}
                  minValue={0}
                  rounded
                  onChange={value =>
                    setCourseDurationObj({ ...courseDurationObj, Min: value })
                  }
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    paddingBottom: 10,
                    fontSize: 12,
                    color: '#rgb(79, 96, 56)',
                  }}>
                  {'Max Hours'}
                </Text>
                <NumericInput
                  step={1}
                  valueType="real"
                  type="up-down"
                  initValue={courseDurationObj.Max}
                  totalHeight={40}
                  totalWidth={110}
                  value={courseDurationObj.Max}
                  minValue={0}
                  rounded
                  onChange={value =>
                    setCourseDurationObj({ ...courseDurationObj, Max: value })
                  }
                />
              </View>
              {/* <NumberInputComponent title={"Min Hours"} value={courseDurationObj.Min} changefun={(value) => setCourseDurationObj({ ...courseDurationObj, Min: value })} />
                            <NumberInputComponent title={"Max Hours"} value={courseDurationObj.Max} changefun={(value) => setCourseDurationObj({ ...courseDurationObj, Max: value })} /> */}
            </View>
            {!!courseDurationObj.Max &&
              courseDurationObj.Min > courseDurationObj.Max && (
                <Text style={{ color: 'red', paddingTop: 5 }}>
                  {' '}
                  Max hours should be greater then Min{' '}
                </Text>
              )}
          </View>
        </List.Accordion>
      </View>
    );
  };

  const handleInputChange = text => {
    // if (/^\d+$/.test(text) || text === '')
    // if (/^\d+$/.test(text) || text === '')
    // if (/^\d+((\.\d{,3})|\d*)$/.test(text) || text === '')
    console.log(parseFloat(text));
    // console.log(/^(?![0.]+$)\d+(\.\d{1,2})?$/.test(text))
    // if (/^(?![0]+$)\d+(\.\d{1,2})?$/.test(text) || text === '')

    // ^(?![0.]+$)\d+(\.\d{1,2})?$
    // if((^(?![0.]+$)\d+(\.\d{1,2})?$)
    // if(parseFloat(text))
    setPriceRangeObj({ ...priceRangeObj, Min: text });
  };
  const priceRangeComponent1 = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <IconMaterialIcons
            name={'cash-multiple'}
            // color="rgb(102, 94, 94)"
            size={25}
            style={{ paddingVertical: 5, paddingHorizontal: 15 }}
            onPress={() => remmoveRecentlyViewedCourses(item)}
          />
          <Text style={{ marginTop: 5, fontSize: 16, letterSpacing: 1 }}>
            {' '}
            Price Range
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <TextInput
            mode="outlined"
            // label="Email"
            keyboardType="numeric"
            placeholder="Min"
            value={priceRangeObj.Min}
            theme={{ colors: { primary: 'black' } }}
            style={{
              // paddingRight: 30,
              backgroundColor: '#fff',
              width: 80,
              height: 35,
            }}
            onChangeText={text => handleInputChange(text)}
          />
          <Text
            style={{
              // paddingVertical: 15,
              paddingHorizontal: 10,
            }}>
            {' '}
            --{' '}
          </Text>
          <TextInput
            mode="outlined"
            // label="Email"
            theme={{ colors: { primary: 'black' } }}
            placeholder="Max"
            keyboardType="numeric"
            value={priceRangeObj.Max}
            style={{
              width: 80,
              height: 35,
              backgroundColor: '#fff',
            }}
            onChangeText={text =>
              setPriceRangeObj({ ...priceRangeObj, Max: value })
            }
          />
        </View>
      </View>
    );
  };

  const priceRangeComponent = () => {
    return (
      // <View style={{ flexDirection: 'row', marginTop: 25, alignItems: "center", flexWrap: "wrap" }}>
      //     <IconMaterialIcons
      //         name={"cash-multiple"}
      //         size={18}
      //         style={{ paddingVertical: 5, paddingLeft: 10, paddingRight: 7 }}
      //     />
      //     <Text style={{ fontSize: 18, }}> {"Price Range"} </Text>
      //     <View >
      //         <View style={{ flexDirection: 'row' }}>
      //             <View style={{ alignItems: "center", paddingRight: 10 }}>
      //                 <Text style={{ paddingBottom: 10, fontSize: 14, color: "#rgb(79, 96, 56)" }}>{"Min"}</Text>
      //                 <NumericInput
      //                     initValue={priceRangeObj.Min}
      //                     totalHeight={40}
      //                     totalWidth={110}
      //                     value={priceRangeObj.Min}
      //                     minValue={0}
      //                     rounded onChange={value => setPriceRangeObj({ ...priceRangeObj, Min: value })} />
      //             </View>
      //             <View style={{ alignItems: "center" }}>
      //                 <Text style={{ paddingBottom: 10, fontSize: 14, color: "#rgb(79, 96, 56)" }}>{"Max"}</Text>
      //                 <NumericInput
      //                     initValue={priceRangeObj.Max}
      //                     totalHeight={40}
      //                     totalWidth={110}
      //                     value={priceRangeObj.Max}
      //                     minValue={0}
      //                     rounded onChange={value => setPriceRangeObj({ ...priceRangeObj, Max: value })} />
      //             </View>
      //         </View>
      //     </View>
      // </View>
      <View style={{ justifyContent: 'center', marginTop: 10, paddingLeft: 3 }}>
        <List.Accordion
          title="Price Range"
          titleStyle={{ color: 'black', fontSize: 16 }}
          style={{ color: 'black' }}
          expanded={priceRangeexpanded}
          onPress={() => setPriceRangeexpanded(!priceRangeexpanded)}
          left={props => (
            <IconMaterialIcons
              color={Colors.black}
              name="cash-multiple"
              size={16}
              style={{ margin: 0 }}
            />
          )}>
          <View style={styles.numericInputContainerView}>
            <View style={styles.numericInputContainer}>
              <View style={{ alignItems: 'center', paddingRight: 10 }}>
                <Text
                  style={{
                    paddingBottom: 10,
                    fontSize: 12,
                    color: '#rgb(79, 96, 56)',
                  }}>
                  {'Min'}
                </Text>
                <NumericInput
                  step={100}
                  valueType="real"
                  // step={0.5}
                  type="up-down"
                  initValue={priceRangeObj.Min}
                  totalHeight={40}
                  totalWidth={110}
                  value={priceRangeObj.Min}
                  minValue={0}
                  rounded
                  onChange={value =>
                    setPriceRangeObj({ ...priceRangeObj, Min: value })
                  }
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    paddingBottom: 10,
                    fontSize: 12,
                    color: '#rgb(79, 96, 56)',
                  }}>
                  {'Max'}
                </Text>
                <NumericInput
                  step={100}
                  valueType="real"
                  type="up-down"
                  initValue={priceRangeObj.Max}
                  totalHeight={40}
                  totalWidth={110}
                  value={priceRangeObj.Max}
                  minValue={0}
                  rounded
                  onChange={value =>
                    setPriceRangeObj({ ...priceRangeObj, Max: value })
                  }
                />
              </View>
              {/* <NumberInputComponent title={"Min"} value={priceRangeObj.Min} changefun={(value) => setPriceRangeObj({ ...priceRangeObj, Min: value })} />
                            <NumberInputComponent title={"Max"} value={priceRangeObj.Max} changefun={(value) => setPriceRangeObj({ ...priceRangeObj, Max: value })} /> */}
            </View>
            {!!priceRangeObj.Max && priceRangeObj.Min > priceRangeObj.Max && (
              <Text style={{ color: 'red', paddingTop: 5 }}>
                {' '}
                Max Price should be greater then Min{' '}
              </Text>
            )}
          </View>
        </List.Accordion>
      </View>
    );
  };

  const SwitchComponent = ({ icon, title, value, onchange }) => {
    return (
      <TouchableOpacity onPress={() => onchange(!value)}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 25,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <IconMaterialIcons
            name={icon}
            size={16}
            style={{ paddingVertical: 5, paddingLeft: 10, paddingRight: 7 }}
          />
          <Text style={{ fontSize: 15, width: '55%' }}> {title} </Text>
          <Switch value={value} onValueChange={value => onchange(value)} />
        </View>
      </TouchableOpacity>
    );
  };

  const democomponent = () => {
    return (
      <SwitchComponent
        icon={'eye-outline'}
        title={'Demo'}
        value={demoObj}
        onchange={value => setDemoObj(value)}
      />
    );
  };

  const currentAvailableComponent = () => {
    return (
      <View style={{ marginTop: 15 }}>
        <SwitchComponent
          icon={'calendar-check-outline'}
          title={'Currently Available'}
          value={currentlyAvailableObj}
          onchange={value => setCurrentlyAvailableObj(value)}
        />
      </View>
    );
  };

  const minimumRatingComponent = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 30, paddingLeft: 3 }}>
        <List.Accordion
          title="Minimum Rating"
          titleStyle={{ color: 'black', fontSize: 16 }}
          style={{ color: 'black' }}
          left={props => (
            <IconMaterialIcons
              color={Colors.black}
              size={16}
              name="heart-outline"
              style={{ margin: 0 }}
            />
          )}>
          <View style={styles.recentSearchsItem}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 16,
              }}>
              <Rating
                type="star"
                ratingTextColor="black"
                showRating
                imageSize={20}
                startingValue={minRatingObj}
                style={{ height: 30 }}
                onFinishRating={rating => setMinRatingObj(rating)}
              />
            </View>
          </View>
        </List.Accordion>
      </View>
    );
  };

  const getSelectedCourseLevels = () => {
    var selectedLevelsArr = [];
    Object.keys(courseLevelObj).forEach(function(key) {
      if (courseLevelObj[key]) selectedLevelsArr.push(key);
    });
    // console.log(selectedLevelsArr)
    return selectedLevelsArr;
  };

  const buildFilterObj = () => {
    var obj = { $and: [] };

    let selectedLevelsArr = getSelectedCourseLevels();
    if (selectedLevelsArr.length) {
      obj['$and'].push({
        'coursedetails.courselevel': { $in: selectedLevelsArr },
      });
    }

    if (courseDurationObj.Min) {
      var hoursObj = {
        'coursedetails.totalhours': { $gte: courseDurationObj.Min },
      };
    }
    if (
      courseDurationObj.Max &&
      courseDurationObj.Max >= courseDurationObj.Min
    ) {
      if (!hoursObj) var hoursObj = { 'coursedetails.totalhours': {} };
      hoursObj['coursedetails.totalhours']['$lte'] = courseDurationObj.Max;
    }
    if (hoursObj) obj['$and'].push(hoursObj);

    if (priceRangeObj.Min) {
      var priceObj = {
        $or: [
          { 'coursedetails.price.oneonone': { $gte: priceRangeObj.Min } },
          { 'coursedetails.price.group.price': { $gte: priceRangeObj.Min } },
        ],
      };
    }
    if (
      priceRangeObj.Max ||
      (priceRangeObj.Max &&
        priceRangeObj.Min &&
        priceRangeObj.Max >= priceRangeObj.Min)
    ) {
      if (!priceObj)
        var priceObj = {
          $or: [
            { 'coursedetails.price.oneonone': {} },
            { 'coursedetails.price.group.price': {} },
          ],
        };
      priceObj['$or'][0]['coursedetails.price.oneonone']['$lte'] =
        priceRangeObj.Max;
      priceObj['$or'][1]['coursedetails.price.group.price']['$lte'] =
        priceRangeObj.Max;
    }
    if (priceObj) obj['$and'].push(priceObj);

    if (demoObj) obj['$and'].push({ 'coursedetails.demo': { $eq: demoObj } });

    if (currentlyAvailableObj)
      obj['$and'].push({ 'coursedetails.status': { $eq: 'Available' } });

    if (minRatingObj)
      obj['$and'].push({ 'coursedetails.avgrating': { $gte: minRatingObj } });

    setFilterObj(obj);
    applyFilter(obj);
  };

  const clearFilterObj = () => {
    setCourseLevelObj({});
    setCourseDurationObj({ Min: 0, Max: 0 });
    setPriceRangeObj({ Min: 0, Max: 0 });
    setDemoObj(false);
    setCurrentlyAvailableObj(false);
    setMinRatingObj(0);
    clearFilter();
  };

  const disableApply = () => {
    return (
      (courseDurationObj.Max &&
        courseDurationObj.Min > courseDurationObj.Max) ||
      (priceRangeObj.Max && priceRangeObj.Min > priceRangeObj.Max)
    );
  };

  const footerButtonsComponent = () => {
    return (
      <View style={{ marginTop: 50, marginBottom: 130 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <FAB
            small={true}
            icon="close"
            label="Clear"
            style={{ backgroundColor: 'white' }}
            color="rgb(0, 150, 136)"
            onPress={() => clearFilterObj()}
          />
          <FAB
            style={styles.fab}
            small={true}
            icon="check"
            label="Apply"
            // color="white"
            disabled={disableApply()}
            style={{ backgroundColor: 'white' }}
            color="rgb(0, 150, 136)"
            // style={{ backgroundColor: disableApply() ? "" : "rgb(0, 150, 136)" }}
            onPress={buildFilterObj}
          />
        </View>
      </View>
    );
  };

  return (
    <View>
      <View>{headerComponent()}</View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {courseLevelComponent()}

        {courseDurationComponent()}

        {priceRangeComponent()}

        {democomponent()}

        {currentAvailableComponent()}

        {minimumRatingComponent()}

        {footerButtonsComponent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  courseLevelItemText: {
    marginTop: 5,
    fontSize: 15,
    letterSpacing: 1,
  },
  courseLevelItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  numericInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numericInputContainerView: {
    justifyContent: 'center',
    // paddingVertical: 10,
    alignItems: 'center',
    paddingLeft: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
    paddingLeft: 40,
    alignItems: 'center',
  },
  headerComponent: {
    // flex: 1,
    flexDirection: 'row',
    padding: 8,
    height: 50,
    // backgroundColor: "rgb(0, 150, 136)",
    // backgroundColor: "rgb(3, 218, 196)",
    backgroundColor: '#509A9C',
    // width: 80,
    alignItems: 'center',
    // justifyContent: "center",
    // elevation: 4,
  },
});
