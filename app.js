const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const fileUpload = require('express-fileupload')

const indexRouter = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024
    }
}))

app.use('/', indexRouter)
app.use(express.static('uploads'))

module.exports = app
