'use strict'

import Mock from 'mockjs';
import queryString from 'query-string';
import _ from 'lodash';
import config from './config';

//这哥么是个变量,,后面有个{} SO 哥么就是一个对象!!
let request={

}

    //设定params json对象
    request.get = (url,params) => {
        if(params){
            url += '?' + queryString.stringify(params)
        }
        //发送网络请求了!!
        return fetch(url)
            .then((response)=>response.json())
            .then((response) => Mock.mock(response))
    }

    request.post = (url,body) => {
        //合并 json对象
        let map = _.extend(config.map,{
            body:JSON.stringify(body)
        });

        return fetch(url,map)
                .then((response)=>response.json())
                .then((response)=>Mock.mock(response))

    }



module.exports = request;
