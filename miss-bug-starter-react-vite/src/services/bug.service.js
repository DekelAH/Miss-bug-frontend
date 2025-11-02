
import axios from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { showErrorMsg } from './event-bus.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://127.0.0.1:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadBugReportPDF
}


function query(filterBy = {}) {
    filterBy = { ...filterBy }
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (!filterBy.txt) filterBy.txt = ''
            if (!filterBy.severity) filterBy.severity = Infinity
            const regExp = new RegExp(filterBy.txt, 'i')
            return bugs.filter(bug =>
                regExp.test(bug.title) &&
                bug.severity <= filterBy.severity
            )
        })
}

function getById(bugId) {

    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {

    return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {

    return axios.get(BASE_URL + 'save', { params: bug }).then(res => res.data)
}

function downloadBugReportPDF() {

    return axios.get('http://127.0.0.1:3030/api/bugs-report', { responseType: 'blob' })
        .then(res => {
            const contentType = res.headers['content-type'] || 'application/pdf'
            const blob = new Blob([res.data], { type: contentType })
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl

            const disposition = res.headers['content-disposition'] || ''
            const fileNameMatch = disposition.match(/filename="?([^";]+)"?/) 
            a.download = fileNameMatch ? fileNameMatch[1] : 'bugs-report.pdf'
            document.body.appendChild(a)
            a.click()
            a.remove()

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
            return true
        })
        .catch(err => {
            showErrorMsg('Failed to download PDF report', err)
            throw err
        })
}

function getDefaultFilter() {

    return { txt: '', severity: '' }
}