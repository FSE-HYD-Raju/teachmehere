import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  FlatList,
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  styles,
  defaultAccentColor,
  heightBottomThreshold,
  heightTopThreshold,
  openedKeyboardHeight,
} from './styles';

const AutoComplete = props => {
  const {
    data,
    displayKey,
    onSelect,
    textInputStyle,
    isMandatory,
    value,
    placeholder,
    label,
    placeholderColor = defaultAccentColor,
    maxHeight,
    floatBottom,
    editable = true,
    dropDownIconColor = defaultAccentColor,
    clearValue = false,
  } = props;

  const [filteredData, setFilteredData] = useState([]);
  const [mData, setMData] = useState([]);
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const sugestionsListPos = useRef({});
  const newRef = useRef();

  const filterData = str => {
    const fData =
      data &&
      data.filter(
        e =>
          e[displayKey] &&
          e[displayKey].toUpperCase().includes(str.toUpperCase()),
      );
    setFilteredData(fData);
    setSelectedItem(str);
  };

  useEffect(() => {
    if (data && data.length && data[0] !== filterData[0]) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!value || (Object.keys(value).length !== 0 && value !== selectedItem)) {
      setSelectedItem(value?.name);
    }
  }, [value]);

  useEffect(() => {
    filteredData &&
      filteredData.length > 0 &&
      setMData(filteredData.slice(0, 10 * page));
  }, [filteredData, page]);

  const _handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSelection = item => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    setFilteredData(data);
    setSelectedItem(item?.name);
    setTimeout(() => {
      onSelect && onSelect(item ? item : selectedItem);
      if (clearValue) {
        setSelectedItem('');
      }
    }, 0);
  };

  const handleOnFocus = () => {
    if (data && data.length > 0) {
      displaySuggestions(undefined);
    }
    if (selectedItem) {
      setSelectedItem('');
    }
    setIsFocused(true);
  };

  const handleOnSubmitEditing = () => {
    setShowSuggestions(false);
    setTimeout(() => {
      if (selectedItem) {
        onSelect && onSelect(selectedItem);
        clearValue && setSelectedItem('');
      }
    }, 0);
  };

  const displaySuggestions = str => {
    newRef.current.measure((fx, fy, width, height, px, py) => {
      let elementHeight = height;
      let elementPosition = py;

      let spaceAboveElement = elementPosition;
      let spaceBelowElement =
        openedKeyboardHeight - (elementPosition + elementHeight);
      sugestionsListPos.current = {
        top: elementHeight,
        maxHeight: maxHeight || spaceBelowElement - heightBottomThreshold,
      };

      if (
        !floatBottom &&
        spaceAboveElement - heightTopThreshold >
          spaceBelowElement - heightBottomThreshold
      ) {
        sugestionsListPos.current = {
          bottom: elementHeight,
          maxHeight: maxHeight || spaceAboveElement - heightTopThreshold,
        };
      }

      setShowSuggestions(true);
    });
  };
  return (
    <View style={[{ width: '100%' }, textInputStyle]}>
      {label && <Text style={styles.autoCompleteLabel}>{label}</Text>}
      <TextInput
        ref={newRef}
        {...props}
        placeholder={placeholder}
        onSubmitEditing={handleOnSubmitEditing}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          fontSize: 14,
          borderRadius: 6,
          flex: 1,
          height: 47,
        }}
        value={selectedItem}
        onChangeText={data => filterData(data)}
        onFocus={handleOnFocus}
        onBlur={() => {
          setIsFocused(false);
          setShowSuggestions(false);
        }}
        clearTextOnFocus="true"
      />

      {showSuggestions && (
        <View style={[styles.suggestionArea, sugestionsListPos.current]}>
          <FlatList
            nestedScrollEnabled
            scrollEnabled={true}
            scrollToOverflowEnabled
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
            onEndReached={_handleLoadMore}
            onEndReachedThreshold={0.5}
            data={mData}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  // selectedItem[displayKey] = '';
                  handleSelection(item);
                }}>
                <View style={[styles.suggestionElementView]}>
                  <Text caps style={[styles.suggestionItem]} numberOfLines={1}>
                    {item[displayKey]}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AutoComplete;
