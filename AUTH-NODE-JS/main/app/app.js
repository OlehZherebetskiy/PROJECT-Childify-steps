import DatabaseService from '../js/components/databaseService'
import DatastoreService from '../js/components/datastoreService'
import TokenService from '../js/components/tokenService'
import SwaggerUi from 'swagger-ui-express'
import SwaggerDocument from '../../test/api/swagger'
import express from 'express'
import bodyParser from 'body-parser'
import ApiService from '../js/components/apiService.js'

global.app = express()

app.use(bodyParser.json({extended: true}))
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerDocument))

app.DatabaseService = new DatabaseService()
app.DatastoreService = new DatastoreService()
app.TokenService = TokenService

ApiService.start(app)
app.TokenService.expiredTokenService()