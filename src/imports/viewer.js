import Vue from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Viewer.setDefaults({
    Options: { inline: true, button: true, navbar: true, title: true, toolbar: true, tooltip: true, movable: true, zoomable: true, rotatable: true, scalable: true, transition: true, fullscreen: true, keyboard: true, url: 'data-source' },
})

Vue.use(Viewer)
