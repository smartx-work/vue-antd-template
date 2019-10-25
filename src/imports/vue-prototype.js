import Vue from 'vue'

// 输入框工具集
Vue.prototype.$input = {
    trim: (e) => e.target.value = e.target.value.trim(),
}

// 新开窗口
Vue.prototype.$openWindow = function (route) {
    window.open(this.$router.resolve(route).href, '_blank')
}
