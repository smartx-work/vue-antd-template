<template>
  <div v-if="waitDraw === false" class="pdf-viewer">
    <pdf-drawer v-for="(item, i) in pdfs" :key="i" :pdf-page="item" />
  </div>
</template>

<script>
import pdfDrawer from './pdf-drawer'
export default {
    components: {
        pdfDrawer,
    },
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    data () {
        return {
            waitDraw: true,
            pdfs: [],
        }
    },
    created () {
        this.option.draw = option => {
            if (this.waitDraw === false) {
                return
            }
            this.waitDraw = false
            this.loadPdf(option)
        }
    },
    mounted () {},
    methods: {
        loadPdf (option) {
            getDocument(option).then(pdfDocument => {
                const pdfs = (this.pdfs = [])
                const pageLoaded = []
                for (let i = 0; i < pdfDocument.numPages; i++) {
                    pageLoaded.push(
                        pdfDocument.getPage(i + 1).then(pdfPage => {
                            pdfs[i] = pdfPage
                            this.pdfs = [ ...pdfs ]
                            return pdfPage
                        })
                    )
                }
                /*
                Promise.all(pageLoaded).then(pdfs => {
                    // this.pdfs = pdfs;
                }) */
            })

            function getDocument (option) {
                return import('pdfjs-dist/webpack').then(pdfjsLib => {
                    return pdfjsLib.getDocument(option).promise
                })
            }
        },
    },
}
</script>

<style>
.pdf-viewer {
  display: block;
  width: 840px;
  height: 900px;
  overflow-y: scroll;
  border: 1px solid #ccc;
}
</style>
