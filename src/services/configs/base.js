import { saveAs } from 'file-saver'

export const downloadFile = [ ':source', {
    method: 'get',
    responseType: 'arraybuffer',
    resa (res, { params: { name, type, code } }) {
        const blob = new Blob([ res ], { type })
        saveAs(blob, `${code}.pdf`)
    },
} ]
