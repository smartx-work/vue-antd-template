import Vue from 'vue'
Vue.prototype.$input = {
    trim: (e) => e.target.value = e.target.value.trim(),

}
