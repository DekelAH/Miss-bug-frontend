
import Axios from 'axios'
import { showErrorMsg } from './event-bus.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development')
    ? 'api/'
    : 'http://127.0.0.1:3030/api/'
    

const axios = Axios.create({

    withCredentials: true,
})

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getEmptyUser,

    query,
    getById,
    save,
    remove
}

async function query() {

    try {
        const { data: users } = await axios.get(BASE_URL + 'user')
        return users
    } catch (err) {
        console.log('err: ', err)
        throw err
    }

}

async function getById(userId) {

    const res = await axios.get(BASE_URL + 'user/' + userId)
    return res.data
}

async function remove(userId) {

    try {
        const { data } = await axios.delete(BASE_URL + 'user/' + userId)
        return data
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(userToSave) {

    const url = BASE_URL+ 'user/' + (userToSave._id || '')
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

async function login(credentials) {
    const { data: user } = await axios.post(BASE_URL + 'auth/login', credentials)
    console.log('user', user);
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {

    const { data: user } = await axios.post(BASE_URL + 'auth/signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_URL + 'auth/logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}