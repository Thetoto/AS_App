import React from 'react';
import axios from "axios";
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  DrawerLayoutAndroid,
  FlatList,
  StyleSheet,
  Modal
} from 'react-native';
import {
  RkCard,
  RkText,
  RkStyleSheet
} from 'react-native-ui-kitten';
import {data} from '../../data';
import {Avatar, GradientButton} from '../../components';
import {SocialBar} from '../../components';
import { UIConstants } from '../../config/appConstants';
import { RkTextInput } from 'react-native-ui-kitten/src/components/textinput/rkTextInput';
import { RkButton } from 'react-native-ui-kitten/src/components/button/rkButton';
import { RkAvoidKeyboard } from 'react-native-ui-kitten/src/components/avoidKeyboard/rkAvoidKeyboard';
import { scale } from '../../utils/scale';
import { FontAwesome } from '../../assets/icons';
import ImageView from 'react-native-image-view';
import { ComDrawer } from '../../components/comdrawer';

export class Article extends React.Component {
  static navigationOptions = ({navigation}) => {

    return (
      {
        title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Image': navigation.state.params.title,
      });
  };

  constructor(props) {
    super(props);
    let {params} = this.props.navigation.state;
    this.id = params ? params.id : 1;
    this.authorid = params ? params.authorid : 1;
    this.author = params ? params.author : "User";
    this.type = params ? params.type : "fanimage";
    this.state = {
      title: "Loading...",
      img: "http://",
      desc: "Loading...",
      page:2,
      comments: [{
        "id": "-1",
        "date": "",
        "author": {
          "id": "1",
          "name": "Loading...",
          "avatar": "https://loading.io/spinners/spinner/index.ajax-spinner-preloader.gif"
        },
        "content": "Loading...",
      }],
      isVisible: false,
      width: Dimensions.get('window').width,
      height: 200,
      message: ""
      
    }
  }

  componentDidMount() {
    this.getData();

  }

  getSize() {
    Image.getSize(this.state.img, (width, height) => {
      let ratio = width / this.state.width;
      let newH = height/ratio
      this.setState({height : newH});
    });
    
  }

  getData() {
    let that = this;
    axios.request({
      method: "get",
      url: "http://as-api.thetoto.tk/" + this.type + "/fr/" + UIConstants.getCurrentSite() + '/' + this.authorid + '/' + this.id,
      responseType:'json'
    }).then(res => {
      that.setState({
        title: res.data.title,
        img: "https://www.animationsource.org/" + res.data.img,
        desc: res.data.desc,
        comments: res.data.comment
      });
      this.getSize();
      this.props.navigation.setParams({title: res.data.title});
    });
  }

  render() {
    let modal = (
      <ImageView
        title={this.state.title}
        source={{uri: this.state.img}}
        isVisible={this.state.isVisible}
      />
      );
    return (
      <ComDrawer url={"http://as-api.thetoto.tk/" + this.type + "/fr/" + UIConstants.getCurrentSite() + '/' + this.authorid + '/' + this.id}  comments={this.state.comments} navigation={this.props.navigation}>
      <ScrollView style={styles.root}>
        <RkCard rkType='article'>
        <TouchableOpacity onPress={() => {
                  //Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.ALL);
                  this.setState({isVisible: true});
                }}>
          <Image rkCardImg style={{height: this.state.height, width: this.state.width}} source={{uri: this.state.img}}/>
          </TouchableOpacity>
          {modal}
          <View rkCardHeader>
            <View>
              <RkText style={styles.title} rkType='header4'>{this.state.title}</RkText>
              <RkText rkType='secondary2 hintColor'>{this.author}</RkText>
            </View>
            <RkButton onPress={() => this.props.navigation.navigate('Artist', {type: this.type, authorid: this.authorid, author: this.author})} style={styles.button} rkType='icon circle'>
                <RkText rkType='moon awesome large primary'>{FontAwesome[this.type]}</RkText>
            </RkButton>
          </View>
          <View rkCardContent>
            <View>
              <RkText rkType='primary3 bigLine'>{this.state.desc}</RkText>
            </View>
          </View>
        </RkCard>
      </ScrollView>
      </ComDrawer>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  title: {
    marginBottom: 5
  },
}));