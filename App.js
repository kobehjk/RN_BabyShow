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
    Navigator,
} from 'react-native';

import List from './Component/List/list';
import Edit from './Component/Edit/edit';
import Picture from './Component/Picture/picture';
import Account from './Component/Account/account';
import Login from './Component/Account/login';

import HKTabBar from './HKTabBar'

import ScrollabelTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';

export default class App extends Component {
    constructor(props){
        super(props);
        this.state={
             tabNames:['视频','录制','图片','我的'],
             tabIconNames:['ios-videocam-outline','ios-recording',
                 'ios-reverse-camera','ios-contact']
        }
    }


    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        return (
           <ScrollabelTabView
               renderTabBar={()=><HKTabBar tabNames={tabNames} tabIconNames={tabIconNames} />}

               tabBarPosition="bottom"
               scrollWithoutAnimation={true}
               locked={true}
               initialPage={3}
           >


               <Navigator
                   tabLabel="list"
                   initialRoute={{name:'list',component:List,
                        params:{
                            title:'视频列表',
                        }
                   }}
                   renderScene={
                       (route,natigator) =>
                           <route.component {...route.params} navigator={natigator}/>
                   }
                   configureScene={
                       (route,routeStack) => {
                           return({
                               ...Navigator.SceneConfigs.FloatFromRight,
                               gestures:{
                                   pop:{
                                       ...Navigator.SceneConfigs.FloatFromRight.gestures.pop,
                                       edgeHitWidth: 0,
                                   }
                               }

                           })
                       }
                   }

               />

               <Edit tabLabel="edit"/>
               <Picture tabLabel="pic"/>
               <Login tabLabel="login"/>
           </ScrollabelTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

