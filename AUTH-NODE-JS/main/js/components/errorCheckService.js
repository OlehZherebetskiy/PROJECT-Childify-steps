
import ResponseService from './responseService'

export default /* ErrorCheckService */ {

    checkSignInRequest(username, password, res) {
        return new Promise(function (resolve, reject) {
            if (!username || !password) {
                ResponseService.wrongRequestData(res)
                throw new Error('Wrong request data!');
            }
            else { resolve() }
        })
    },

    checkSignUpRequest(username, password, res) {
        return new Promise(function (resolve, reject) {
            if (!username || !password) {
                ResponseService.wrongRequestData(res)
                throw new Error('Wrong request data!');
            }
            else { resolve() }
        })
    },

    checkSignOutRequest(access, refresh, res) {
        return new Promise(function (resolve, reject) {
            if (!access || !refresh) {
                ResponseService.wrongRequestData(res)
                throw new Error('Wrong request data!');
            }
            else { resolve() }
        })
    },

    checkDeleteUserRequest(token, res) {
        return new Promise(function (resolve, reject) {
            if (!token) {
                ResponseService.wrongRequestData(res)
                throw new Error('Wrong request data!');
            }
            else { resolve() }
        })
    },

    checkRefreshRequest(token, res) {
        return new Promise(function (resolve, reject) {
            if (!token) {
                ResponseService.wrongRequestData(res)
                throw new Error('Wrong request data!');
            }
            else { resolve() }
        })
    },

    checkIfExistDBData(err, data, res) {
        return new Promise(function (resolve, reject) {
            if (err) {
                ResponseService.databaseError(res)
                throw new Error('Database error!');
            }    
            else if (data.length > 1) {
                ResponseService.databaseError(res)
                throw new Error('Multiple data!');
            }        
            else if (!data[0]) {
                ResponseService.wrongData(res)
                throw new Error('Wrong data!');
            }
            else {
                resolve()
            }
        })
    },

    checkIfNotExistDBData(err, data, res) {
        return new Promise(function (resolve, reject) {
            if (err) {
                ResponseService.databaseError(res)
                throw new Error('Database error!');
            }        
            else if (data.length > 0) {
                ResponseService.databaseError(res)
                throw new Error('Multiple data!');
            }
            else {
                resolve()
            }
        })
    },

    checkBcryptCompare(err, result, res) {
        return new Promise(function (resolve, reject) {
            if (!result) {
                ResponseService.passwordWrong(res)
                throw new Error('Password is wrong!')
            }
            else if (err) {
                ResponseService.systemError(res)
                throw new Error('System error!')
            }
            resolve()
        })
    },

    checkTokenVerify(err, result, res) {
        return new Promise(function (resolve, reject) {
            
            if (err ) {
                ResponseService.tokenExpired(res)
                throw new Error('Token expired!')
            }
            else if (!result) {
                ResponseService.tokenWrong(res)
                throw new Error('Token is wrong!')
            }
            resolve()
        })
    },

    checkBcryptCraeteHash(err, result, res) {
        return this.checkBcryptCompare(err, result, res)
    }
}