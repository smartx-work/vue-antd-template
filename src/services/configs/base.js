import { saveAs } from 'file-saver'

export const downloadFile = [ ':source', { // 导出文件
    method: 'get',
    responseType: 'arraybuffer',
    resa (res, { params: { name, type, code } }) {
        const blob = new Blob([ res ], { type })
        saveAs(blob, `${code}.pdf`)
    },
    datam () {
        return {}
    },
} ]


export const getAreaPickerDatas = [ 'common/areas/:code', {
    datam ({ code }) {
        if (code === 0) {
            return [
                { label: '浙江省', value: 'P1' },
                { label: '上海市', value: 'P2' },
            ]
        }

        if (code === 'P1') {
            return [
                { label: '杭州市', value: 'C1-1' },
                { label: '丽水市', value: 'C1-2' },
            ]
        }

        if (code === 'P2') {
            return [
                { label: '上海市', value: 'C1-1' },
            ]
        }
        if (code === 'C1-2') {
            return [
                { label: '莲都区', value: 'C1-2-1' },
                { label: '缙云县', value: 'C1-2-2' },
            ]
        }
        if (code === 'C1-2-1') {
            return [
                { label: '紫金街道办事处', value: 'C1-2-1-1' },
                { label: '火车东站', value: 'C1-2-1-2' },
            ]
        }
        return []
    },
    delay: 10,
} ]
