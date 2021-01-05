import bcrypt from 'bcrypt-nodejs'
import ErrorCheckService from './errorCheckService.js'

export default /* BcryptService */ {

    async compare (password, user, res) {
        var promise = new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                ErrorCheckService.checkBcryptCompare(err, result, res)
                .then(() => {

                    resolve(user)
                })
            })
        })
        return await promise
    },

    async createHash (password, res) {
        var promise = new Promise((resolve, reject) => {
            bcrypt.hash(password, null, null, (err, hash) => { 
                ErrorCheckService.checkBcryptCraeteHash(err, hash, res)
                .then(() => {

                    resolve(hash)
                })
            })
        })
        return await promise
    }
}