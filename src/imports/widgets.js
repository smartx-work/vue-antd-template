import Vue from 'vue'

import DataFilter from '@/components/widgets/data-filter'
/*
import Card from '@/components/mr/card'
import Table from '@/components/mr/table'
import OperateBar from '@/components/mr/operate-bar'
import DataFilter from '@/components/mr/data-filter'
import DataView from '@/components/mr/data-view'
import Upload from '@/components/mr/upload'
import DataTabs from '@/components/mr/data-tabs'
import Form from '@/components/mr/form'
import AreaPicker from '@/components/mr/area-picker'
import Dialog from '@/components/mr/dialog' */

const components = {
    DataFilter,
    // Card, Table, OperateBar, DataFilter, DataView, Upload, DataTabs, Form, AreaPicker, Dialog,
}

for (const name in components) {
    Vue.component(`widget${name.replace(/([A-Z])/g, (match, letter) => `-${letter.toLowerCase()}`)}`, components[name])
}
