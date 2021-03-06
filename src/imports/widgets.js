import Vue from 'vue'
import Card from '@/components/widgets/card'
import DataFilter from '@/components/widgets/data-filter'
import DataView from '@/components/widgets/data-view'
import Form from '@/components/widgets/form'
import Dialog from '@/components/widgets/dialog'
import AreaPicker from '@/components/widgets/area-picker'
/*

import Table from '@/components/widgets/table'
import OperateBar from '@/components/widgets/operate-bar'
import DataFilter from '@/components/widgets/data-filter'
import DataView from '@/components/widgets/data-view'
import Upload from '@/components/widgets/upload'
import DataTabs from '@/components/widgets/data-tabs'

import AreaPicker from '@/components/widgets/area-picker'
import Dialog from '@/components/widgets/dialog' */

const components = {
    Card, DataFilter, DataView, Form, Dialog, AreaPicker,
    // Card, Table, OperateBar, DataFilter, DataView, Upload, DataTabs, Form, AreaPicker, Dialog,
}

for (const name in components) {
    Vue.component(`wgt${name.replace(/([A-Z])/g, (match, letter) => `-${letter.toLowerCase()}`)}`, components[name])
}
