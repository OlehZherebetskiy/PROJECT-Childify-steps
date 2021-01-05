export default /* ResponseService */ {
    successSignIn(res, accessToken, refreshToken) {
        res.status(200).json({
            massage: 'Signed in successfully',
            accessToken,
            refreshToken
        })
    },

    successSignUp(res) {
        res.status(200).send({
            massage: 'Signed up successfully'
        })
    },

    successSignOut(res) {
        res.status(200).send({
            massage: 'Signed out successfully'
        })
    },

    successDeleteUser(res) {
        res.status(200).send({
            massage: 'Deleted user successfully'
        })
    },

    successRefresh(res, accessToken, refreshToken) {
        res.status(200).json({
            massage: 'Refreshed successfully',
            accessToken,
            refreshToken
        })
    },

    wrongCredentials(res) {
        res.status(403).send({
            error: 'Wrong credentials'
        })
    },

    systemError(res) {
        res.status(400).send({
            error: 'System error'
        })
    },

    wrongRequestData(res) {
        res.status(403).send({
            error: 'Wrong request data'
        })
    },

    wrongData(res) {
        res.status(403).send({
            error: 'Wrong data'
        })
    },

    databaseError(res) {
        res.status(400).send({
            error: 'Database error'
        })
    },

    passwordWrong(res) {
        res.status(403).send({
            error: 'Password is wrong'
        })
    },

    tokenExpired(res) {
        res.status(400).send({
            error: 'Token expired!'
        })
    },

    tokenWrong(res) {
        res.status(403).send({
            error: 'Token is wrong!'
        })
    }
}