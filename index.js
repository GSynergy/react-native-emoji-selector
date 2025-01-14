import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const emoji = require("./emoji.json");

export const getEmojiSkinsList = unicode => {
  let emojiSkinsList = [];
  for (const _emoji of emoji) {
    const skinsList = Object.values(_emoji?.skin_variations || {}).map(emoji => emoji.unified);
    if (_emoji.unified === unicode || skinsList.some(value => value === unicode)) {
      emojiSkinsList = skinsList.concat([_emoji.unified]);
      break;
    }
  };
  return emojiSkinsList;
};

const favouriteEmojis = [
  {
    name: "THUMBS UP SIGN",
    unified: "1F44D",
    short_name: "+1",
    short_names: ["+1", "thumbsup"],
    text: null,
    texts: null,
    category: "Smileys & Emotion",
    sort_order: 176,
    skin_variations: {
      "1F3FB": {
        unified: "1F44D-1F3FB",
      },
      "1F3FC": {
        unified: "1F44D-1F3FC",
      },
      "1F3FD": {
        unified: "1F44D-1F3FD",
      },
      "1F3FE": {
        unified: "1F44D-1F3FE",
      },
      "1F3FF": {
        unified: "1F44D-1F3FF",
      },
      "1F44D": {
        unified: "1F44D",
      },
    },
  },
  {
    name: "THUMBS DOWN SIGN",
    unified: "1F44E",
    short_name: "-1",
    short_names: ["-1", "thumbsdown"],
    text: null,
    texts: null,
    category: "Smileys & Emotion",
    sort_order: 177,
    skin_variations: {
      "1F3FB": {
        unified: "1F44E-1F3FB",
      },
      "1F3FC": {
        unified: "1F44E-1F3FC",
      },
      "1F3FD": {
        unified: "1F44E-1F3FD",
      },
      "1F3FE": {
        unified: "1F44E-1F3FE",
      },
      "1F3FF": {
        unified: "1F44E-1F3FF",
      },
      "1F44E": {
        unified: "1F44E",
      },
    },
  },
  {
    name: "WHITE MEDIUM STAR",
    unified: "2B50",
    short_name: "star",
    short_names: ["star"],
    text: null,
    texts: null,
    category: "Travel & Places",
    sort_order: 965,
  },
  {
    name: "BLACK HEART SUIT",
    unified: "2665-FE0F",
    short_name: "hearts",
    short_names: ["hearts"],
    text: null,
    texts: null,
    category: "Activities",
    sort_order: 1065,
  },
  {
    name: "WARNING SIGN",
    unified: "26A0-FE0F",
    short_name: "warning",
    short_names: ["warning"],
    text: null,
    texts: null,
    category: "Symbols",
    sort_order: 1342,
  },
];

export const Categories = {
  all: {
    name: "All",
    icon: null,
  },
  history: {
    name: "Recently used",
    icon: require("./assets/Recent_Gray.png"),
    unSelectedIcon: require("./assets/Recent_Gray_Light.png"),
  },
  emotion: {
    name: "Smileys & Emotion",
    icon: require("./assets/Smileys_People_Gray.png"),
    unSelectedIcon: require("./assets/Smileys_People_Gray_Light.png"),
  },
  nature: {
    name: "Animals & Nature",
    icon: require("./assets/Animals_Nature_Gray.png"),
    unSelectedIcon: require("./assets/Animals_Nature_Gray_Light.png"),
  },
  food: {
    name: "Food & Drink",
    icon: require("./assets/Food_Drink_Gray.png"),
    unSelectedIcon: require("./assets/Food_Drink_Gray_Light.png"),
  },
  activities: {
    name: "Activities",
    icon: require("./assets/Activity_Gray.png"),
    unSelectedIcon: require("./assets/Activity_Gray_Light.png"),
  },
  places: {
    name: "Travel & Places",
    icon: require("./assets/Travel_Places_Gray.png"),
    unSelectedIcon: require("./assets/Travel_Places_Gray_Light.png"),
  },
  objects: {
    name: "Objects",
    icon: require("./assets/Objects_Gray.png"),
    unSelectedIcon: require("./assets/Objects_Gray_Light.png"),
  },
  symbols: {
    name: "Symbols",
    icon: require("./assets/Symbols_Gray.png"),
    unSelectedIcon: require("./assets/Symbols_Gray_Light.png"),
  },
  flags: {
    name: "Flags",
    icon: require("./assets/Flags_Gray.png"),
    unSelectedIcon: require("./assets/Flags_Gray_Light.png"),
  },
};

const charFromUtf16 = (utf16) =>
  String.fromCodePoint(...utf16.split("-").map((u) => "0x" + u));
export const charFromEmojiObject = (obj) => charFromUtf16(obj.unified);
const filteredEmojis = emoji.filter((e) => !e["obsoleted_by"]);
const emojiByCategory = (category) =>
  filteredEmojis.filter((e) => e.category === category);
const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

const TabBar = ({ theme, activeCategory, onPress, width }) => {
  const tabSize = width / categoryKeys.length;
  return categoryKeys.map((c) => {
    const category = Categories[c];
    if (c !== "all")
      return (
        <TouchableOpacity
          key={category.name}
          onPress={() => onPress(category)}
          style={{
            flex: 1,
            height: tabSize,
            borderColor: category === activeCategory ? theme : "#EEEEEE",
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              category === activeCategory
                ? category.icon
                : category.unSelectedIcon
            }
            style={{
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
      );
  });
};

const TriangleCorner = () => {
  return <View style={styles.triangleCorner} />;
};

const EmojiCell = ({ emoji, colSize, multipleSkins, ...other }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        width: colSize,
        height: Platform.OS === "android" ? colSize + 4 : colSize,
        alignItems: "center",
        justifyContent: "center",
      }}
      {...other}
    >
      <Text style={{ color: "#FFFFFF", fontSize: colSize - 12 }}>
        {charFromEmojiObject(emoji)}
      </Text>
      {multipleSkins && <TriangleCorner />}
    </TouchableOpacity>
  );
};

const storage_key = "@react-native-emoji-selector:HISTORY";
const history_filtered_key = "@react-native-emoji-selector:HISTORY_FILTERED";

export default class EmojiSelector extends Component {
  state = {
    searchQuery: "",
    category: Categories.history,
    isReady: false,
    history: [],
    emojiList: null,
    colSize: 0,
    width: 0,
    height: 0,
    selectedEmoji: undefined,
    showSkins: false,
  };

  //
  //  HANDLER METHODS
  //
  handleTabSelect = (category) => {
    if (this.state.isReady) {
      if (this.scrollview)
        this.scrollview.scrollToOffset({ x: 0, y: 0, animated: false });
      this.setState({
        searchQuery: "",
        category,
      });
    }
  };

  getSkinsList = (emojiData) => {
    return Object.values(emojiData?.skin_variations || {}).map((skin) => skin.unified).concat([emojiData.unified]);
  };

  getEmojiType = (emoji, emojiData) => {
    const emojiSkins = {};
    emojiSkins[emoji] = this.getSkinsList(emojiData)
    return emojiSkins;
  };

  handleEmojiSelect = (emoji) => {
    const { category, showSkins, selectedEmoji } = this.state;

    if (!this.props.showSkinVariations) {
      const emojiType = this.getEmojiType(emoji.unified, emoji);
      this.props.onEmojiSelected(emojiType);
    } else if (emoji.skin_variations) {
      this.setState({ showSkins: true, selectedEmoji: emoji });
    } else {
      this.props.onEmojiSelected(emoji.unified);
      if (showSkins) this.setState({ showSkins: false });
      if (selectedEmoji) this.setState({ selectedEmoji: undefined });
    }
    if (!showSkins && category.name !== "history") {
      this.addToHistoryAsync(emoji);
    }
  };

  uniqueEmojisOnly = (emojis) => {
    let uniqueEmojis = [];
    for (let i = 0; i < emojis.length; i++) {
      let isDuplicate = false;
      for (let j = i + 1; j < emojis.length; j++) {
        if (emojis[i].unified === emojis[j].unified) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueEmojis.push(emojis[i]);
      }
    }

    return uniqueEmojis;
  };

  handleSearch = (searchQuery) => {
    this.setState({ searchQuery });
  };

  addToHistoryAsync = async (emoji) => {
    let history = await AsyncStorage.getItem(storage_key);
    let value = [];
    if (!history) {
      // no history
      let record = Object.assign({}, emoji, { count: 1 });
      value.push(record);
    } else {
      let json = JSON.parse(history);
      if (json.filter((r) => r.unified === emoji.unified).length > 0) {
        value = json;
      } else {
        let record = Object.assign({}, emoji, { count: 1 });
        value = [record, ...json];
      }
    }

    AsyncStorage.setItem(storage_key, JSON.stringify(value));
    const uniqueEmojis = this.uniqueEmojisOnly([...favouriteEmojis, ...value]);
    this.setState({
      history: uniqueEmojis,
    });
  };

  loadHistoryAsync = async () => {
    let result = await AsyncStorage.getItem(storage_key);
    if (result) {
      return JSON.parse(result);
    }
  };

  getMultipleSkinEmojis = (emoji) => {
    let multipleSkinEmojis = [];
    if (emoji && emoji.skin_variations) {
      for (const [key, value] of Object.entries(emoji.skin_variations)) {
        // '1F44D and 1F44E are default THUMBS UP and THUMBS DOWN emoji skins. Don't Want To Show Those as Skins But Needed In Data for Searching'
        if (value.unified !== "1F44D" && value.unified !== "1F44E")
          multipleSkinEmojis.push({ key: key, emoji: value });
      }
    }
    return multipleSkinEmojis;
  };

  getFilteredHistory = history => {
    const allEmojiSkins = new Set();
    emoji.forEach(reaction => {
      allEmojiSkins.add(reaction.unified)
      if (reaction.skin_variations) {
        Object.values(reaction.skin_variations).forEach(value => {
          allEmojiSkins.add(value.unified)
        })
      }
    })
    return history.filter(recentReaction => allEmojiSkins.has(recentReaction.unified))
  }

  //
  //  RENDER METHODS
  //

  renderEmojiCell = ({ item }) => {
    return (
      <EmojiCell
        key={item.key}
        emoji={item.emoji}
        onPress={() => this.handleEmojiSelect(item.emoji)}
        colSize={this.state.colSize}
        multipleSkins={Boolean(item.emoji.skin_variations)}
      />
    );
  };

  returnSectionData() {
    const { history, emojiList, searchQuery, category } = this.state;
    let emojiData = (() => {
      if (category === Categories.all && searchQuery === "") {
        //TODO: OPTIMIZE THIS
        let largeList = [];
        categoryKeys.forEach((c) => {
          const name = Categories[c].name;
          const list =
            name === Categories.history.name ? history : emojiList[name];
          if (c !== "all" && c !== "history")
            largeList = largeList.concat(list);
        });

        return largeList.map((emoji) => ({ key: emoji.unified, emoji }));
      } else {
        let list;
        const hasSearchQuery = searchQuery !== "";
        const name = category.name;
        if (hasSearchQuery) {
          const filtered = emoji.filter((e) => {
            let display = false;
            e.short_names.forEach((name) => {
              if (name.includes(searchQuery.toLowerCase())) display = true;
            });
            return display;
          });
          list = sortEmoji(filtered);
        } else if (name === Categories.history.name) {
          list = history;
        } else {
          list = emojiList[name];
        }
        return list.map((emoji) => ({ key: emoji.unified, emoji }));
      }
    })();
    return this.props.shouldInclude
      ? emojiData.filter((e) => {
          if (e.emoji.skin_variations) {
            for (const skin of Object.values(e.emoji.skin_variations)) {
              if (!this.props.shouldInclude(skin)) return false;
            }
            return true;
          }
          return this.props.shouldInclude(e.emoji);
        })
      : emojiData;
  }

  prerenderEmojis(callback) {
    let emojiList = {};
    categoryKeys.forEach((c) => {
      let name = Categories[c].name;
      emojiList[name] = sortEmoji(emojiByCategory(name));
    });

    this.setState(
      {
        emojiList,
        colSize: Math.floor(this.state.width / this.props.columns),
      },
      callback
    );
  }

  handleLayout = ({ nativeEvent: { layout } }) => {
    this.setState({ width: layout.width, height: layout.height }, () => {
      this.prerenderEmojis(() => {
        this.setState({ isReady: true });
      });
    });
  };

  keyExtractor = (item) => item.key;

  //
  //  LIFECYCLE METHODS
  //
  async componentDidMount() {
    let history = favouriteEmojis;
    const recentlyUsed = await this.loadHistoryAsync();
    if (recentlyUsed) {
      history = [...history, ...recentlyUsed];
      let isHistoryFiltered = await AsyncStorage.getItem(history_filtered_key);
      if(!isHistoryFiltered) {
        history = this.getFilteredHistory(history);
        const value = history.map(emoji => Object.assign({}, emoji, { count: 1 }));
        AsyncStorage.setItem(storage_key, JSON.stringify(value));
        AsyncStorage.setItem(history_filtered_key, "true");
      }
    }
    history = this.uniqueEmojisOnly(history);
    this.setState({ history });
  }

  render() {
    const {
      theme,
      columns,
      placeholder,
      showHistory,
      showSearchBar,
      showSectionTitles,
      showTabs,
      ...other
    } = this.props;

    const { category, colSize, isReady, searchQuery, height, selectedEmoji } =
      this.state;

    const Searchbar = (
      <View style={styles.searchbar_container}>
        <TextInput
          style={styles.search}
          placeholder={placeholder}
          clearButtonMode="always"
          returnKeyType="done"
          autoCorrect={false}
          underlineColorAndroid={theme}
          value={searchQuery}
          onChangeText={this.handleSearch}
        />
      </View>
    );

    const title =
      searchQuery !== ""
        ? "Search Results"
        : category.name === "Smileys & Emotion"
        ? "Smileys, Emotion & Gestures"
        : category.name;

    return (
      <View style={styles.frame} {...other} onLayout={this.handleLayout}>
        <View style={styles.tabBar}>
          {showTabs && (
            <TabBar
              activeCategory={category}
              onPress={this.handleTabSelect}
              theme={theme}
              width={this.state.width}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          {showSearchBar && Searchbar}
          {isReady ? (
            <View style={{ flex: 1 }}>
              <View style={styles.container}>
                {showSectionTitles && (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
                <FlatList
                  style={styles.scrollview}
                  contentContainerStyle={{ paddingBottom: colSize }}
                  data={this.returnSectionData()}
                  renderItem={this.renderEmojiCell}
                  horizontal={false}
                  numColumns={columns}
                  keyboardShouldPersistTaps={"always"}
                  ref={(scrollview) => (this.scrollview = scrollview)}
                  removeClippedSubviews
                />
              </View>
            </View>
          ) : (
            <View style={styles.loader} {...other}>
              <ActivityIndicator
                size={"large"}
                color={Platform.OS === "android" ? theme : "#000000"}
              />
            </View>
          )}
        </View>
        <Modal
          transparent={true}
          visible={this.state.showSkins}
          onRequestClose={() => {
            this.setState({ showSkins: false });
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ showSkins: false })}
            style={{
              height: height + height / 2,
              ...styles.modalBackground,
            }}
          />
          <View style={styles.multipleSkinEmojis}>
            <FlatList
              data={this.getMultipleSkinEmojis(selectedEmoji)}
              renderItem={this.renderEmojiCell}
              keyExtractor={this.keyExtractor}
              horizontal={true}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.setState({ showSkins: false })}
            style={{ flex: 1, ...styles.modalBackground }}
          />
        </Modal>
      </View>
    );
  }
}

EmojiSelector.defaultProps = {
  theme: "#007AFF",
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  columns: 6,
  placeholder: "Search...",
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: "100%",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
  },
  scrollview: {
    flex: 1,
  },
  searchbar_container: {
    width: "100%",
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  search: {
    paddingLeft: 8,
    margin: 8,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: "100%",
    color: "#8F8F8F",
  },
  modalBackground: {
    width: "100%",
    backgroundColor: "rgba(200,200,200,0.75)",
  },
  multipleSkinEmojis: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: "transparent",
    borderTopColor: "rgba(200,200,200,0.75)",
    alignSelf: "flex-end",
    transform: [{ rotate: "180deg" }],
  },
});
