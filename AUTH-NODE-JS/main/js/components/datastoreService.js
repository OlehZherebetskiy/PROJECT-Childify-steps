import 'nedb'
import ErrorCheckService from './errorCheckService.js'

export default class DatastoreService {
    
    add (DB, data) {
        DB.insert(data)
    }

    delete (DB, data) {
        DB.remove(data)
    }

    checkIfNotExist (DB, data, res) {
        return new Promise(async (resolve, reject) => {
            var result = await this.find(DB, data)

            ErrorCheckService.checkIfNotExistDBData(result.err, result.data, res)
            .then( () => {

                resolve(result.data[0])
            })
        })
    }

    checkIfExist (DB, data, res) {
        return new Promise(async (resolve, reject) => {
            var result = await this.find(DB, data)

            ErrorCheckService.checkIfExistDBData(result.err, result.data, res)
            .then( () => {

                resolve(result.data[0])
            })
        })
    }

    find (DB, data) {
        return new Promise((resolve, reject) => {
            DB.find(data, (err, data) => {
                resolve({
                    err: err,
                    data: data
                })
            })
        })
    }
}