var express = require('express')
var router = express.Router()

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


module.exports = router
