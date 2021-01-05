import config from '../../resource/config/config'
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v4'
import ErrorCheckService from './errorCheckService'
import ResponseService from './responseService'

export default /* TokenService */ {

    createTokens(user) {
      return {
        refreshToken : jwt.sign({id: user._id, uuid: uuid()}, config.secret, config.REFRESHTOKENLIVETIME),
        accessToken : jwt.sign({id: user._id, uuid: uuid()}, config.secret, config.ACCESSTOKENLIVETIME)
      }
    },

    addToken(user, tokens) {
      app.DatastoreService.add(app.DatabaseService.getDatastore().refreshTokenDB, { refreshToken: tokens.refreshToken })
      app.DatastoreService.add(app.DatabaseService.getDatastore().accessTokenDB, {id: user._id, accessToken: tokens.accessToken })
    },

    async verify (Token, res) {
      var promise = new Promise((resolve, reject) => {
        jwt.verify(Token, config.secret, (err, decoded) => {
              ErrorCheckService.checkTokenVerify(err, decoded, res)
              .then(() => {

                  resolve(decoded.id)
              })
          })
      })
      return await promise
    },
    
    refresh(req, res) {
      const rToken = req.body.refreshToken;

      ErrorCheckService.checkRefreshRequest(rToken, res)
      .then( () => {

        app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().refreshTokenDB, {refreshToken: rToken}, res)
        .then( (refreshToken) => {

          this.verify(refreshToken.refreshToken, res)
          .then( (id) => {

            app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().userDB, {_id: id}, res)
            .then( (user) => {

              app.DatastoreService.delete(app.DatabaseService.getDatastore().refreshTokenDB, refreshToken)
              app.DatastoreService.delete(app.DatabaseService.getDatastore().accessTokenDB, {id: id})

              var tokens = this.createTokens(user)

              this.addToken(user, tokens)

              ResponseService.successRefresh(res, tokens.accessToken, tokens.refreshToken)
            })
          })
        })
      })
    },

    expiredTokenService() {
      setTimeout( () => {
        app.DatabaseService.getDatastore().accessTokenDB.find({}, (err, docs) => {
          docs.forEach( (Token) => {
            jwt.verify(Token, config.secret, (err, decoded) => {
              if(err){
                app.DatastoreService.delete(app.DatabaseService.getDatastore().accessTokenDB, Token)
              }
            })
          })
        })

        app.DatabaseService.getDatastore().refreshTokenDB.find({}, (err, docs) => {
          docs.forEach( (Token) => {
            jwt.verify(Token, config.secret, (err, decoded) => {
              if(err){
                app.DatastoreService.delete(app.DatabaseService.getDatastore().refreshTokenDB, Token)
              }
            })
          })
        })
        console.log("CLEANERTOKEN")
        this.expiredTokenService()
      }, config.CLEANERTOKENTIME)
    }
}