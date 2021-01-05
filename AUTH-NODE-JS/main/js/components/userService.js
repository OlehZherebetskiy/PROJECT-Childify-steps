import TokenService from './tokenService'
import ResponseService from './responseService'
import ErrorCheckService from './errorCheckService'

export default /* UserService */ {

  deleteUser(req, res) {
    const aToken = req.body.accessToken

    ErrorCheckService.checkDeleteUserRequest(aToken, res)
    .then( () => {

      app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().accessTokenDB, {accessToken: aToken}, res)
      .then( (accessToken) => {

        TokenService.verify(accessToken.accessToken, res)
        .then( (id) => {

          app.DatastoreService.checkIfExist(app.DatabaseService.getDatastore().userDB, {_id: id}, res)
          .then( (user) => {
            
            app.DatastoreService.delete(app.DatabaseService.getDatastore().userDB, user)

            ResponseService.successDeleteUser(res)
          })
        })
      })
    })
  }
}