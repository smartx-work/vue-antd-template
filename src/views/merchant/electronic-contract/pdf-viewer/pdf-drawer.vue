<template>
  <div v-loading="!pdfPage" class="pdf-drawer">
    <canvas ref="canvas" class="canvas" />
  </div>
</template>

<script>
export default {
    components: {},
    props: {
        pdfPage: {
            type: [ Object, undefined ],
            required: true,
        },
    },
    data () {
        return {}
    },
    beforeMount () {
        // ...
    },
    mounted () {
        this.drawPDF()
    },
    methods: {
        drawPDF () {
            const viewport = this.pdfPage.getViewport({ scale: 1 })
            const viewportWidth = viewport.width
            const ratio = viewportWidth / viewport.height // 比率
            const width = 800
            const height = 800 / ratio

            const canvas = this.$refs.canvas
            canvas.width = width
            canvas.height = height
            this.pdfPage.render({
                canvasContext: canvas.getContext('2d'),
                viewport: this.pdfPage.getViewport({
                    scale: 800 / viewportWidth,
                }),
            })
        },
    },
}
</script>

<style>
.pdf-drawer {
  width: 802px;
  border-bottom: 1px solid #ccc;
  margin: 10px;
}
.pdf-drawer .canvas {
  display: block;
}
</style>
