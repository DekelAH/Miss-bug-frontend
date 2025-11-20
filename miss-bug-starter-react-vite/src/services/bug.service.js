
import Axios from 'axios'
import { showErrorMsg, showSuccessMsg } from './event-bus.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = (process.env.NODE_ENV !== 'development') 
                ? 'api/bug/'
                : 'http://127.0.0.1:3030/api/bug/'

const axios = Axios.create({

        withCredentials: true,
    })

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadBugReportPDF,
    getEmptyBug
}

async function query(filterBy) {
console.log(process.env.NODE_ENV)
    try {
        const { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
        return bugs
    } catch (err) {
        console.log('err: ', err)
        throw err
    }

}

async function getById(bugId) {

    const res = await axios.get(BASE_URL + bugId)
    return res.data
}

async function remove(bugId) {

    try {
        const { data } = await axios.delete(BASE_URL + bugId)
        return data
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(bugToSave) {

    const url = BASE_URL + (bugToSave._id || '')
    const method = bugToSave._id ? 'put' : 'post'

    try {

        const { data: savedBug } = await axios[method](url, bugToSave)
        console.log(savedBug)
        return savedBug
    } catch (err) {

        console.log('error: ', err)
        throw err
    }
}

async function downloadBugReportPDF() {
    try {
        const res = await axios.get('http://127.0.0.1:3030/api/bug/report', {
            responseType: 'blob'
        })

        const contentType = res.headers['content-type'] || 'application/pdf'
        const blob = new Blob([res.data], { type: contentType })
        const blobUrl = URL.createObjectURL(blob)

        const element = document.createElement('a')
        element.href = blobUrl
        element.style.display = 'none'

        const disposition = res.headers['content-disposition'] || ''
        const fileNameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        const fileName = fileNameMatch ? fileNameMatch[1].replace(/['"]/g, '') : 'bugs-report.pdf'
        element.download = fileName

        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)

        setTimeout(() => URL.revokeObjectURL(blobUrl), 100)

        showSuccessMsg('PDF report downloaded successfully')
        return true
    } catch (err) {
        console.error('Failed to download PDF report:', err)
        showErrorMsg('Failed to download PDF report')
        throw err
    }
}

function getDefaultFilter() {

    return {
        txt: '',
        severity: 0,
        labels: [],
        sortBy: '',
        sortDir: 1,
        pageIdx: 0
    }
}

function getEmptyBug(title = '', severity = 0, description = '') {
    return { title, severity, description }
}