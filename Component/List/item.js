/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';


import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

import config from '../common/config';
import request from '../common/request';

export default class item extends Component {

    constructor(props){
        super(props);
        this.state={
            rowData:this.props.rowData,
            up:this.props.rowData.voted,
        }
    }

    _up=()=>{
        let up = !this.state.up;
        let rowData = this.state.rowData;
        let url = config.api.base+config.api.up;
        let body = {
            id:rowData._id,
            up:up ? 'yes':'no',
            accessToken:'www',
        }
        //发送网络请求
        request.post(url,body)
            .then(
                (data)=>{
                    if(data && data.success){
                        this.setState({
                            up:up
                        });
                    }else{
                        alert('网络错误,请稍后再试!')
                    }
                }
            ).catch(
            (err)=>{
                alert('网络错误,请稍后再试!')
            }
        )

    };

    render() {
        let rowData = this.state.rowData;

        return (
            <TouchableOpacity onPress={this.props.onSelect}>
                {/*整个Cell*/}
                <View style={styles.cellStyle}>
                    {/*标题文字*/}
                    <Text style={styles.title}>{rowData.title}</Text>
                    {/*封面图片*/}
                    <Image style={styles.thumbStyle} source={{uri:rowData.thumb}}>
                        <Icon name="ios-play"
                              size={30}
                              style={styles.play}
                        />
                    </Image>
                    {/*cellFooter*/}
                    <View style={styles.cellFooter}>
                        {/*点赞*/}
                        <View style={styles.footerBox} >
                            <Icon name={this.state.up ? "ios-heart":"ios-heart-outline"}
                                  size={30}
                                  style={[styles.up,this.state.up?null:styles.down]}
                                  onPress={this._up}
                            />
                            {/*点赞文字*/}
                            <Text style={styles.BoxText}
                                  onPress={this._up}
                            >点赞</Text>
                        </View>
                        {/*评论*/}
                        <View style={styles.footerBox}>
                            <Icon name="ios-chatbubbles"
                                  size={30}
                                  style={styles.BoxIcon}
                            />
                            {/*点赞文字*/}
                            <Text style={styles.BoxText}>评论</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cellStyle:{
        width:width,
        marginTop:10,
        backgroundColor:'white'
    },
    title:{
        fontSize:18,
        padding:10,
        color:'black',
    },
    thumbStyle:{
        width:width,
        height:width*0.56,
        resizeMode:'cover',
    },
    play:{
        position:'absolute',
        bottom:14,
        right:14,
        width:46,
        height:46,
        paddingTop:9,
        paddingLeft:18,
        backgroundColor:'transparent',
        borderColor:'black',
        borderWidth:1,
        borderRadius:23
    },
    cellFooter:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#dddddd'
    },
    footerBox:{
        padding:10,
        flexDirection:'row',
        backgroundColor:'white',
        flex:1,
        marginLeft:1,
        justifyContent:'center',
    },
    BoxIcon:{
        fontSize:22,
        color:'#333'
    },
    BoxText:{
        fontSize:18,
        color:'#333',
        paddingLeft:12,
    },
    up:{
        fontSize:22,
        color:'red'
    },
    down:{
        fontSize:22,
        color:'#333'
    }
});

