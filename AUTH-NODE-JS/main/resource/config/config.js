export default {
    PORT: process.env.PORT || 3000,
    secret: 'verysicret',
    ACCESSTOKENLIVETIME: {expiresIn: '200000ms'},
    REFRESHTOKENLIVETIME: {expiresIn:'400000ms'},
    dataBasePath: '../../resource/dbDatastore/',
    CLEANERTOKENTIME: 200000000
}