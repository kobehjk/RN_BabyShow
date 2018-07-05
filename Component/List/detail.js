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
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
    ListView,
    TextInput,
    Modal,
} from 'react-native';

import Video from 'react-native-video';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';


import config from '../common/config';
import request from '../common/request';

const {width,height} = Dimensions.get('window');

//定义一个全局的对象
let cachedResults={
    nexPage:1,
    items:[],
    total:0,
}

export default class Detail extends Component {
    constructor(props){
        super(props);
        this.state={
            rowData:this.props.rowData,
            rate: 1,//播放速率
            volume: 1,
            muted: false,//静音
            resizeMode: 'contain',
            paused: false,//暂停
            videoError:false,//错误

            duration: 0.0,
            currentTime: 0.0,
            videoLoaded:false,
            playing:false,
            playEnd:false,

            dataSource:new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1 !== r2,
            }),

            isLoadingTail:false,

            //关于模态视图的属性
            animationType:'fade',//none,fade,slide
            modalVisible:false,//模态视图是否显示
            transparent:false,//是否半透明

            content:'',
            btnDisable:true,
        }


        // this._onLoadStart = this._onLoadStart.bind(this);
        // this._onLoad = this._onLoad.bind(this);
        this._onProgress = this._onProgress.bind(this);
        // this._onEnd = this._onEnd.bind(this);
        // this._onError = this._onError.bind(this);

        this._rePlay = this._rePlay.bind(this);
        this._resume = this._resume.bind(this);
        this._pause = this._pause.bind(this);
        this._pop = this._pop.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._focus = this._focus.bind(this);
        this._blur = this._blur.bind(this);
        this._setModalVisible = this._setModalVisible.bind(this);
        this._startShow = this._startShow.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._submitClick = this._submitClick.bind(this);
    }
    _submitClick(){

        this.setState({
            isSendingComment:true,
            btnDisable:true,
        },()=>{
            let body={
                accessToken:'wwwww',
                id_video:'2222333',
                content:this.state.content,
            }
            let url = config.api.base + config.api.comment;
            request.post(url,body)
                .then(
                    (data)=>{
                        if(data && data.success){
                            let items = cachedResults.items.slice();
                            items = [{
                                content:this.state.content,
                                replyBy:{
                                    avatar:'http://tva4.sinaimg.cn/crop.0.0.382.382.180/006mn7b6jw8f0glw4eoycj30am0am3yw.jpg',
                                    nickname:'Hank'
                                }
                            }].concat(items);
                            cachedResults.items = items;
                            cachedResults.total = cachedResults.total + 1;

                            setTimeout( ()=>{
                                this.setState({
                                    dataSource:this.state.dataSource.cloneWithRows(cachedResults.items),
                                    isSendingComment:false,
                                    content:'',
                                    btnDisable:true,
                                })
                                this._setModalVisible(false);
                            } ,2000);




                        }
                    }
                ).catch((err)=>{
                    console.log('评论失败了 '+err);
                    this.setState({
                        isSendingComment:false,
                    })
                    this._setModalVisible(false);
                    alert('评论失败,请稍后重试')
                });
        })


    }
    _closeModal(){
        this._setModalVisible(false);
    }
    _setModalVisible(visible){
        this.setState({
            modalVisible:visible
        });
    }

    _startShow(){

    }


    _focus(){
        //弹出Modal视图
        this._setModalVisible(true);

    }
    _blur(){

    }

    _renderRow(rowData_reply){
        return(
            <View
                style={styles.replyBox}
                key={rowData_reply._id}
            >
                <Image style={styles.replyAvatar}
                       source={{uri:rowData_reply.replyBy.avatar}}
                />
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{rowData_reply.replyBy.nickname}</Text>
                    <Text style={styles.replyContent}>{rowData_reply.content}</Text>
                </View>
            </View>
        )
    }

    componentDidMount(){
        this._fetchData(1);//从服务器获取数据
    }

    //发送请求加载指定数据
    _fetchData(page){
        this.setState({
            isLoadingTail:true
        });

        //发送网络请求
        request.get(config.api.base+config.api.comments,{
            accessToken:'aaaa',
            page:page,
            id:'22233366',
        }).then(
            (data) => {
                if(data.success){
                    //将服务器得到的数据缓存进来!!
                    let items = cachedResults.items.slice();
                        items = items.concat(data.data);
                        cachedResults.nexPage += 1;
                    //最后保存数据
                    cachedResults.items = items;
                    cachedResults.total = data.total;
                    // console.log('总数据是:'+cachedResults.total);
                    // console.log('当前到了第:'+cachedResults.items.length+'个!');

                   //加载更多
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(
                            cachedResults.items
                        ),
                        isLoadingTail:false
                    });
                }
            }
        ).catch(//如果有错
            (err) => {
                this.setState({
                    isLoadingTail:false
                });
                console.log('err'+err);
            }
        )
    }

    _fetchData1(){
        let url = config.api.base + config.api.comments;
        //发送网络请求
        request.get(url,{
            id:"112233",
            accessToken:'jjjj'
        }).then(
            (data)=>{
                if(data && data.success){
                    let comments = data.data;
                    if(comments && comments.length > 0){
                        this.setState({
                            dataSource:this.state.dataSource.cloneWithRows(comments)
                        })
                    }
                }
            }
        ).catch(
            (error)=>{
                console.log('数据有问题');
            }
        )
    }

    _pop(){
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }

    _resume(){
        if(this.state.paused){
            this.setState({
                paused:false
            });
        }
    }

    _pause(){
        if(!this.state.paused){
            this.setState({
                paused:true
            });
        }
    }

    _rePlay(){
        this.setState({
            playEnd:false,
            paused: false,
        })
        this.refs.videoPlayer.seek(0);
    }

    _onLoadStart=()=>{
        console.log('_onLoadStart');
    }
    _onLoad=(data)=>{
        console.log('_onLoad--视频总长度'+data.duration);
        this.setState({duration:data.duration});
    }
    _onProgress(data){
        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            });
        }
        if(!this.state.playing && !this.state.playEnd){
            console.log('进来改变状态');
            this.setState({
                playEnd:false,
                playing:true,
            });
        }

        this.setState({currentTime:data.currentTime});
        //console.log('_onProgress---当前时间'+data.currentTime);
    }

    _onEnd=()=>{
        this.setState({
            playing:false,
            paused:true,
            playEnd:true,
        })
        console.log('结束了');
    }
    _onError=(error)=>{
        console.log('错误'+JSON.stringify(error))
        this.setState({
            videoError:true,
        })
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }


    render() {
        let rowData = this.state.rowData;
        //一个是当前时间,一个是剩余时间
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

        return (
            <View style={styles.container}>
                {/*导航栏*/}
                <View style={styles.navStyle}>
                    {/*返回按钮*/}
                    <TouchableOpacity
                        style={styles.backBox}
                        onPress={this._pop}
                    >
                        <Icon name="ios-arrow-back"
                              style={styles.backIcon}
                        />
                        <Text style={styles.backText}>返回</Text>

                    </TouchableOpacity>
                    {/*中间的文字*/}
                    <Text style={styles.navText} numberOfLines={1}>视频详情页面</Text>
                </View>
                {/*播放器*/}
                <View style={styles.videoBox}>
                    <Video
                        source={{uri:rowData.video}}
                        style={styles.video}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={false}
                        ref='videoPlayer'
                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoad}
                        onProgress={this._onProgress}
                        onEnd={this._onEnd}
                        onError={this._onError}

                    />
                    {/*错误提示*/}
                    {this.state.videoError?
                        <Text style={styles.failText}>很抱歉,你访问的视频飞走了...</Text>
                        :null
                    }

                    {/*小菊花*/}
                    {!this.state.videoLoaded ?
                        <ActivityIndicator
                            color="red"
                            size="large"
                            style={styles.loading}
                        />
                        :null
                    }

                    {/*播放按钮*/}
                    {!this.state.playing && this.state.videoLoaded ?
                        <Icon name='ios-play'
                              size={45}
                              style={styles.play}
                              onPress={this._rePlay}
                        />
                        :null
                    }

                    {/*暂停&&继续*/}
                    {this.state.videoLoaded && this.state.playing?
                        <TouchableOpacity
                            onPress={this._pause}
                            style={styles.pauseStyle}
                        >
                            {this.state.paused?
                                <Icon name='ios-play'
                                      size={45}
                                      style={styles.play}
                                      onPress={this._resume}
                                />
                                :null
                            }

                        </TouchableOpacity>
                        :null
                    }


                    {/*进度条*/}
                    <View style={styles.progress}>
                        <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                        <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                    </View>

                </View>



                {/*评论信息*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow = {this._renderRow}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}

                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                />

                {/*模态视图*/}
                <Modal
                    animationType={this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}

                    //回调
                    onRequestClose={()=>{
                            this._setModalVisible(false)
                        }}
                    onShow={this._startShow}
                >
                    <View style={styles.modalConatiner}>
                        <Icon name='ios-close'
                              size={45}
                              onPress={this._closeModal}
                              style={styles.closeIcon}/>
                        {/*评论的盒子*/}
                        <View style={styles.commentBox}>
                            {/*评论框*/}
                            <View style={styles.comment}>
                                <TextInput
                                    placeholder='过来评论一下...'
                                    style={styles.content}
                                    multiline={true}
                                    defaultValue={this.state.content}
                                    underlineColorAndroid='transparent'

                                    onChangeText={(text)=>{
                                        this.setState({
                                            content:text,
                                            btnDisable:text == ''? true : false
                                        })
                                    }}/>
                            </View>
                        </View>
                        {/*评论按钮*/}
                        <Button style={styles.submitButton}
                                onPress={this._submitClick}
                                disabled={this.state.btnDisable}
                        >评论一下</Button>


                    </View>

                </Modal>

            </View>
        );
    }

    _renderHeader(){
        let rowData = this.state.rowData;
        return(
            <View style={styles.listHeader}>
                {/*作者信息*/}
                <View style={styles.infoBox}
                >
                    {/*头像*/}
                    <Image
                        style={styles.avatar}
                        source={{uri:rowData.author.avatar}}
                    />
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>作者:{rowData.author.nickname}</Text>
                        <Text style={styles.title}>标题:{rowData.title}</Text>
                    </View>

                </View>
                {/*评论*/}
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder='过来评论一下...'
                            style={styles.content}
                            multiline={true}
                            underlineColorAndroid='transparent'

                            onFocus={this._focus}
                            onBlur={this._blur}
                        />
                    </View>
                </View>
                {/*华丽分割线*/}
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>精彩评论</Text>
                </View>


            </View>


        )
    }

    //上拉加载更多!!
    _fetchMoreData = ()=>{
        if(!this._hasMore() || this.state.isLoadingTail){
            return
        }
        let page = cachedResults.nexPage;
        //去服务器去加载更多数据!
        this._fetchData(page)
    }
    //自定义Footer视图
    _renderFooter = ()=>{
        if(!this._hasMore() && cachedResults.total !== 0){
            return(
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多数据啦...</Text>
                </View>
            );
        }

        //显示一朵小菊花!!
        return(
            <ActivityIndicator
                style={styles.loadingMore}
            />
        )
    }

    _hasMore(){
        return cachedResults.items.length < cachedResults.total
    }

    _backToList = ()=>{
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }
}




let videoBoxHeight = 250;
let videoHeight = videoBoxHeight - 10;
let loadingTop = videoBoxHeight * 0.5 - 30;
let playWH = 60;
let playTop = videoBoxHeight * 0.5 - playWH*0.5;
let failTextTop = videoBoxHeight * 0.5 + playWH*0.5;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginTop:Platform.OS === 'ios'?20:0,
    },
    videoBox:{
        width:width,
        height:videoBoxHeight,
        backgroundColor:'black'
    },
    video:{
        width:width,
        height:videoHeight,
        backgroundColor:'black'
    },
    loading:{
        position:'absolute',
        top:loadingTop,
        width:width,
        left:0,
        alignItems:'center',
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 10,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 10,
        backgroundColor: '#2C2C2C',
    },
    play:{
        position:'absolute',
        top:playTop,
        left:width * 0.5 - playWH*0.5,
        width:playWH,
        height:playWH,
        paddingTop:10,
        paddingLeft:22,
        backgroundColor:'transparent',
        borderColor:'black',
        borderWidth:1,
        borderRadius:playWH * 0.5,
    },
    pauseStyle:{
        position:'absolute',
        top:0,
        left:0,
        width:width,
        height:videoHeight,
    },
    failText:{
        position:'absolute',
        left:0,
        width:width,
        top:failTextTop,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'red',
        fontSize:20,
    },
    navStyle:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:64,
        backgroundColor:'#dddddd',
        borderBottomWidth:0.5,
        borderBottomColor:'black',
    },
    backBox:{
        position:'absolute',
        left:12,
        top:25,
        width:60,
        flexDirection:'row',
        alignItems:'center'
    },
    backIcon:{
        fontSize:22,
        marginRight:5
    },
    backText:{
        fontSize:16
    },
    navText:{
        textAlign:'center',
        lineHeight:64,
        height:64,
        fontSize:18,
        width:width - 120,
    },
    infoBox:{
        flexDirection:'row',
        width:width,
        justifyContent:'center',
        marginTop:10,
    },
    avatar:{
        width:60,
        height:60,
        borderRadius:30,
        marginRight:10,
        marginLeft:10
    },
    descBox:{
        flex:1,
    },
    nickname:{
        fontSize:18,
    },
    title:{
        marginTop:8,
        fontSize:16,
        color:'#666',
    },
    replyBox:{
        flexDirection:'row',
        width:width,
        justifyContent:'center',
        marginTop:10,
    },
    replyAvatar:{
        width:40,
        height:40,
        borderRadius:20,
        marginRight:10,
        marginLeft:10
    },
    reply:{
        flex:1
    },
    replyNickname:{
        fontSize:16,
    },
    replyContent:{
        marginTop:5,
        paddingRight:10

    },
    loadingMore:{
        marginVertical:20
    },

    loadingText:{
        fontSize:18,
        color:'#777',
        textAlign:'center'
    },
    listHeader:{
        marginTop:10,
        width:width,
    },
    commentBox:{
        marginTop:5,
        padding:5,
        width:width,


    },
    comment:{},
    content:{
        height:50,
        paddingLeft:5,
        borderWidth:1,
        borderColor:"#ddd",
        color:'#333',
        borderRadius:4,
        fontSize:14,
    },
    commentArea:{
        width:width,
        padding:6,
        borderBottomWidth:1,
        borderBottomColor:'#ddd',

    },
    commentTitle:{
        color:'red'
    },
    modalConatiner:{
        flex:1,
        paddingTop:45,
        alignItems:'center'
    },
    closeIcon:{
        alignSelf:'center',
        fontSize:30,
        marginTop:20,
        color:'red',
    },
    submitButton:{
        width:width-20,
        padding:16,
        marginTop:20,
        borderWidth:1,
        borderColor:'red',
        borderRadius:4,
        fontSize:18,
    }
});

