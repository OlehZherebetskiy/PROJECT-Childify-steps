import BcryptService from './bcryptService'
import ResponseService from './responseService'
import ErrorCheckService from './errorCheckService.js'

export default /* SignService */ {

    signIn(req, res) {
      const username = req.body.username;
      const password = req.body.password;

      ErrorCheckService.checkSignInRequest(username, password, res)
      .then( () => {

        app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().userDB, {username: username}, res)
        .then( (user) => {

          BcryptService.compare(password, user, res)
          .then( (user) => {

            var tokens = app.TokenService.createTokens(user)
            app.TokenService.addToken(user, tokens)
            
            ResponseService.successSignIn(res, tokens.accessToken, tokens.refreshToken)
          })
        })
      })
    },

    signUp(req, res) {
      const username = req.body.username;
      const password = req.body.password;

      ErrorCheckService.checkSignUpRequest(username, password, res)
      .then( () => {

        app.DatastoreService.checkIfNotExist(app.DatabaseService.getDatastore().userDB, {username: username}, res)
        .then(() => {

          BcryptService.createHash(password, res)
          .then((hash) => {
            
            app.DatastoreService.add(app.DatabaseService.getDatastore().userDB, {username: username, password: hash})

            ResponseService.successSignUp(res)
          })
        })
      })
    },

    signOut(req, res) {
      const aToken = req.body.accessToken;
      const rToken = req.body.refreshToken;
      
      ErrorCheckService.checkSignOutRequest(aToken, rToken, res)
      .then( () => {

        app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().accessTokenDB, {accessToken: aToken}, res)
        .then((accessToken) => {

          app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().refreshTokenDB, {refreshToken: rToken}, res)
          .then((refreshToken) => {

            app.DatastoreService.delete(app.DatabaseService.getDatastore().refreshTokenDB, {refreshToken: refreshToken.refreshToken})
            app.DatastoreService.delete(app.DatabaseService.getDatastore().accessTokenDB, {accessToken: accessToken.accessToken})
            
            ResponseService.successSignOut(res)
          })
        })
      })
    }
}