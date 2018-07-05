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
    ListView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get('window');

import config from '../common/config';
import request from '../common/request';
import Item from './item';
import Detail from './detail';
import IosViedo from './iosvideo';

//Mockjs 解析随机的文字
var Mock = require('mockjs');


//定义一个全局的对象  上个厕所..马上来!! 困了的同学去洗个脸!!
let cachedResults={
    nexPage:1,
    items:[],
    total:0,
}



export default class list extends Component {
    constructor(props){
        super(props);
        this.state={
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1,r2)=>r1!==r2,
            }),
            isLoadingTail:false,
            isRefreshing:false,
        };
    }

    //即将显示
    componentDidMount(){
        //加载网络数据
        this._fetchData(1);
    }

    _fetchData(page){

        if(page !== 0){
            this.setState({
                isLoadingTail:true
            });
        }else{
            this.setState({
                isRefreshing:true
            });
        }


        //发送网络请求
        request.get(config.api.base+config.api.list,{
            accessToken:'aaaa',
            page:page
        }).then(
            (data) => {
                if(data.success){
                    //将服务器得到的数据缓存进来!!
                    let items = cachedResults.items.slice();
                    if(page !== 0){
                        items = items.concat(data.data);
                        cachedResults.nexPage += 1;
                    }else{
                        items = data.data.concat(items);

                    }
                    //最后保存数据
                    cachedResults.items = items;
                    cachedResults.total = data.total;
                    // console.log('总数据是:'+cachedResults.total);
                    // console.log('当前到了第:'+cachedResults.items.length+'个!');


                        if(page !== 0){//加载更多
                            this.setState({
                                dataSource:this.state.dataSource.cloneWithRows(
                                    cachedResults.items
                                ),
                                isLoadingTail:false
                            });
                        }else{
                            this.setState({
                                dataSource:this.state.dataSource.cloneWithRows(
                                    cachedResults.items

                                ),
                                isRefreshing:false
                            });
                        }

                }
            }
        ).catch(//如果有错
            (err) => {
                if(page !== 0){
                    this.setState({
                        isLoadingTail:false
                    });
                }else{
                    this.setState({
                        isRefreshing:false
                    })
                }
                console.log('err'+err);
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/*导航条*/}
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        视频列表
                    </Text>
                </View>
                {/* 列表页面 */}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    style={styles.listView}
                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this._renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                />

            </View>
        );
    }




    //下拉刷新
    _onRefresh = ()=>{
        if(!this._hasMore() || this.state.isRefreshing){
            return
        }

        this._fetchData(0)

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





    // 状态机 request = loadMore
    //1.发送请求  2.保存请求参数  3.对比参数!!!
    // 刷新请求   2.保存 request = refresh   ==== 3.对比 refresh == request
    // 加载更多   2.保存 request = loadMore  ==== 3.对比 loadMore == request



    //上拉加载更多!!
    _fetchMoreData = ()=>{
        if(!this._hasMore() || this.state.isLoadingTail){
            return
        }
        let page = cachedResults.nexPage;
        //去服务器去加载更多数据!
        this._fetchData(page)
    }

    _hasMore(){
        return cachedResults.items.length !== cachedResults.total
    }

    //返回Item
    _renderRow = (rowData)=>{
        return(
            <Item rowData={rowData}
                  onSelect={()=>this._loadPage(rowData)}
                  key={rowData._id}

            />
        );
    }

    //跳转新页面
    _loadPage(rowData){
        let {navigator} = this.props;
        if(navigator){
            navigator.push({
                component:Detail,
                params:{
                    rowData:rowData

                }
            })
        }

    }



}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    header:{
        paddingTop:25,
        paddingBottom:15,
        backgroundColor:'#dddddd',
        borderBottomWidth:0.5,
        borderBottomColor:'black',
        marginTop:Platform.OS==='ios'?20:0,
    },
    headerText:{
        fontSize:16,
        fontWeight:'600',
        textAlign:'center',
    },
    listView:{

    },
    loadingMore:{
        marginVertical:20
    },

    loadingText:{
        fontSize:18,
        color:'#777',
        textAlign:'center'
    },

});

