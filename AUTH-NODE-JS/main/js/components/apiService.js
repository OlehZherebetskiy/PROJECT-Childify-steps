import SignService from './signService.js'
import TokenService from './tokenService.js'
import UserService from './userService.js'

export default /* ApiService */ {
    start (app) {
        app.post('/signIn', function (req, res) { SignService.signIn(req, res) })
        app.post('/signUp', function (req, res) { SignService.signUp(req, res) })
        app.delete('/signOut', function (req, res) { SignService.signOut(req, res) })
        app.put('/refresh', function (req, res) { TokenService.refresh(req, res) })
        app.delete('/deleteUser', function (req, res) { UserService.deleteUser(req, res) })
    }
}