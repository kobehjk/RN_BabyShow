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
    TextInput,
} from 'react-native';

import config from '../common/config';
import request from  '../common/request';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            phoneNumber:'',
            codeAlreadySend:false,
            verifyCode:'',
        }

        this._getVerifyCode = this._getVerifyCode.bind(this);
        this._login = this._login.bind(this);
        this._showVerifyCode = this._showVerifyCode.bind(this);

    }
    _showVerifyCode(){
        this.setState({
            codeAlreadySend:true
        })
    }

    _getVerifyCode(){
        //去服务器获取短信验证
        let phoneNumber = this.state.phoneNumber;
        if(!phoneNumber){
            alert('手机号码不能为空!');
           return;
        }

        let body = {
            phoneNumber:phoneNumber
        };
        let url = config.api.base + config.api.verify;
        request.post(url,body)
            .then(
                (data)=>{
                    if(data && data.success){
                        this._showVerifyCode();
                    }else{
                        alert('获取验证码失败了');
                    }
                }
            )
            .catch((err)=>{
                alert('错误'+err);
            })


    }
    _login(){

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <Text style={styles.title}>快速登录</Text>
                    <TextInput
                        placeholder="输入手机号码"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'phone-pad'}
                        underlineColorAndroid="transparent"

                        style={styles.inputStyle}
                        onChangeText={(text)=>
                            this.setState({
                                phoneNumber:text
                            })
                        }
                    />
                    {/*验证码输入框*/}
                    {this.state.codeAlreadySend ?
                        <View style={styles.verifyCodeBox}>
                            <TextInput
                                placeholder="输入验证码"
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'phone-pad'}
                                underlineColorAndroid="transparent"

                                style={styles.inputStyle}
                                onChangeText={(text)=>
                                    this.setState({
                                        verifyCode:text
                                    })
                                }
                            />
                        </View>
                        :
                        null
                    }


                    {/*发送验证码&&登录按钮*/}
                    {this.state.codeAlreadySend ?
                        <View style={styles.btn}>
                            <Text style={styles.btnText}
                                  onPress={this._login}
                            >登录</Text>
                        </View>
                        :
                        <View style={styles.btn}>
                            <Text style={styles.btnText}
                                  onPress={this._getVerifyCode}
                            >获取验证码</Text>
                        </View>
                    }

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    signupBox:{
        marginTop:64,
        padding:10,
    },
    title:{
        marginBottom:20,
        fontSize:20,
        textAlign:'center',
        fontWeight:'bold',
        color:'#333',
    },
    inputStyle:{
        height:40,
        padding:5,
        color:'#666',
        fontSize:16,
        backgroundColor:'white',
        borderWidth:1,
        borderRadius:4,
        marginBottom:10
    },
    btn:{
        height:40,
        backgroundColor:'transparent',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderRadius:4,


    },
    btnText:{
        fontSize:16,
        fontWeight:'bold',
        color:'orange'
    },
    verifyCodeBox:{
        borderRadius:4,
        borderWidth:1,
        height:40,
        marginBottom:10,
    }
});

