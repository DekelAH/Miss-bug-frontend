
import Axios from 'axios'
import { showErrorMsg } from './event-bus.service.js'

const BASE_URL = 'http://127.0.0.1:3030/api/user/'

const axios = Axios.create({

    withCredentials: true,
})

export const userService = {
    query,
    getById,
    save,
    remove
}

async function query() {

    try {
        const { data: users } = await axios.get(BASE_URL)
        return users
    } catch (err) {
        console.log('err: ', err)
        throw err
    }

}

async function getById(userId) {

    const res = await axios.get(BASE_URL + userId)
    return res.data
}

async function remove(userId) {

    try {
        const { data } = await axios.delete(BASE_URL + userId)
        return data
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(userToSave) {

    const url = BASE_URL + (userToSave._id || '')
    const method = userToSave._id ? 'put' : 'post'

    try {

        const { data: savedUser } = await axios[method](url, userToSave)
        console.log(savedUser)
        return savedUser
    } catch (err) {

        console.log('error: ', err)
        throw err
    }
}