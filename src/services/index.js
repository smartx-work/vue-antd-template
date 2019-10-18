function services (id, params, callback) { // 服务id，服务参数，服务完成回调


}


export default services


// e.g


config = [ '用户登录', 'login', {
    type: 'HTTP.POST',
    throwError: true,
    reqAdapter: {

    },
    resAdapter: {

    },
    mock () {

    },
} ]

services('login', { user: 'admin', pwd: '123456' }, () => {
    alert('登录成功！')
})
