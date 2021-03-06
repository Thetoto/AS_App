import React from 'react';
import axios from 'axios';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput
} from 'react-native-ui-kitten';
import {Avatar} from '../../components';
import {FontAwesome} from '../../assets/icons';
import {data} from '../../data';
import { UIConstants } from '../../config/appConstants';
import { ComDrawer } from '../../components/comdrawer';
let moment = require('moment');

export class ChatList extends React.Component {
  static navigationOptions = {
    title: 'Messages privés'
  };

  constructor(props) {
    super(props);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderItem = this._renderItem.bind(this);
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.chats = data.getChatList();
    this.setState({
      data: [{"id":"-1","title":"Loading... ","from":"-","date":"-"}]
    });
    this.getData();
  }

  getData() {
    let that = this;
    if (!UIConstants.isConnect()) {
      alert("Vous n'êtes pas connecté !");
      return;
    }
    axios.request({
      method: "post",
      url: "https://as-api-thetoto.herokuapp.com/mp",
      data: {
        'cookie': UIConstants.getCookie()
      }
    }).then(res => {
      console.log(res.data.mps);
      that.setState({
        data: res.data.mps,
        save: res.data.mps,
      });
    });
  }

  _filter(text) {
    console.log(text);
    if (text == "") {
      this.setState({data: this.state.save});
    }
    let pattern = new RegExp(text,'i');
    let chats = _.filter(this.state.save, (chat) => {
      if (chat.title.search(pattern) != -1
        || chat.from.search(pattern) != -1) {
        return chat;
        }
    });

    this.setState({data: chats});
  }

  _keyExtractor(item, index) {
    return item.id;
  }

  _renderSeparator() {
    return (
      <View style={styles.separator}/>
    )
  }

  _renderHeader() {
    return (
      <View style={styles.searchContainer}>
        <RkTextInput autoCapitalize='none'
                     autoCorrect={false}
                     onChange={(event) => this._filter(event.nativeEvent.text)}
                     label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
                     rkType='row'
                     placeholder='Search'/>
      </View>
    )
  }

  _renderItem(info) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Message', {id: info.item.id})}>
        <View style={styles.container}>
          
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <RkText rkType='header5'>{info.item.title}</RkText>
              <RkText rkType='secondary4 hintColor'>
                {info.item.date}
              </RkText>
            </View>
            <RkText numberOfLines={2} rkType='primary3 mediumLine' style={{paddingTop: 5}}>{info.item.from}</RkText>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      
      <FlatList
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ListHeaderComponent={this.renderHeader}
        ItemSeparatorComponent={this._renderSeparator}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}/>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center'
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingBottom: 12,
    paddingTop: 7,
    flexDirection: 'row'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  }
}));