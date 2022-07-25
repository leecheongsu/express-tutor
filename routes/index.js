const express = require('express')
const fs = require('fs')
const router = express.Router()
const Query = require('pg').Query

// 실시간 처리가 필요할 때 유용함.

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})

router.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({ status: false, message: 'failed' })
        } else {
            const file = req.files.uploadFile
            await file.mv('./uploads/' + file.name)
            res.send({
                status: true, message: 'success', data: {
                    name: file.name,
                    minetype: file.minetype,
                    size: file.size,
                },
            })
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/upload/multi', async (req, res) => {
    try {
        const data = []
        if(!req.files) {
            res.send({ status: false, message: 'failed'})
        } else {
            for (const file of req.files.uploadFiles) {
                await file.mv('./uploads/' + file.name)
                data.push({
                    name: file.name,
                    minetype: file.minetype,
                    size: file.size
                })
            }
            res.send({
                status: true,
                message: 'success',
                data: data,
            })
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

//route params : /:id
//query string : req.query.name

router.get('/read', async (req, res) => {
    try {
        fs.readFile(`./uploads/${req.query.file}`, 'utf-8', function(err, data) {
            if(err != null) {
               res.status(500).send(err)
            }
            //TODO : parsing
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

//method에 국한 되지 않고 받음.
router.all('/secret', async (req, res) => {

}, async (req, res) => {
    // 두개의 콜백 함수 실행 가능.
})

const app = express()

// 하나의 path에 여러개의 method를 chaining 할 수 있음.
app.route('/triple')
    .get('/get', async (req, res, next) => {
        // next 는 콜백인수
    })
    .post()


const requestTime = function(req, res, next) {
    req.requestTime = Date.now()
    next()
}

router.use(requestTime)

router.get('/time', async (req, res) => {
    res.send(req.requestTime)
    // 미들웨어 함수를 등록후 사용할 수 있다.
})

router.use(async (req, res, next) => {
    //마운트 경로가 없을 경우 request가 있을때마다 함수 실행.
})


//어플리케이션 레벨 미들웨어
router.get('/user', async (req, res, next) => {
    console.log(req.originalUrl)
    next()
}, async (req, res, next) => {
    console.log(req.method)
    next()
})


//라우터 레벨 미들웨어
router.get('/user/:id', async(req, res, next) => {
    if(req.params.id === 0) next('route')
    next()
}, async (req, res, next) => {
    res.render('regular page') // id가 0이 아니고 정상페이지 동작할때
})





module.exports = router
