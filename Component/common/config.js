'use strict'



const config = {
    api:{
        base:'http://rap.taobao.org/mockjs/16560/',
        list:'api/list',
        up:'api/up',
        comments:'api/comments',
        comment:'api/comment',
        signup:'api/user/signup',
        verify:'api/user/verify',
    },


    map:{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout:8000,

    }

}





module.exports = config


