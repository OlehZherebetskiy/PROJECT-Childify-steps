import datastore from 'nedb'
import config from '../../resource/config/config'

export default class DatabaseService {
    
    constructor() {

        var userDB = new datastore({filename : config.dataBasePath + 'users', autoload: true});
        var refreshTokenDB = new datastore({filename : config.dataBasePath + 'refreshToken', autoload: true});
        var accessTokenDB = new datastore({filename : config.dataBasePath + 'accessToken', autoload: true});

        userDB.ensureIndex({ fieldName: 'user', unique: true });
        refreshTokenDB.ensureIndex({ fieldName: 'refreshToken', unique: true });
        accessTokenDB.ensureIndex({ fieldName: 'accessToken', unique: true });
        
        this.setDatastore(userDB, refreshTokenDB, accessTokenDB)
    }
    

    setDatastore (userDB, refreshTokenDB, accessTokenDB) {
        this.userDB = userDB
        this.refreshTokenDB = refreshTokenDB
        this.accessTokenDB = accessTokenDB
    }

    getDatastore () {
        return {
            userDB: this.userDB,
            refreshTokenDB: this.refreshTokenDB,
            accessTokenDB: this.accessTokenDB
        }
    }
}

