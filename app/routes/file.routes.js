const multer = require("multer")
const path = require("path")
const controller = require("../controllers/file.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    const storage = multer.diskStorage({
        destination: './upload/images',
        filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        }
    })

    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }
    })

    app.post('/api/file/upload', upload.single('file'), controller.upload);

    app.get('/api/file/list', controller.getList)
    app.get('/api/file/:id', controller.getFile)
    app.delete('/api/file/delete/:id', controller.remove)
    app.get('/api/file/download/:id', controller.downloadFile)
    app.put('/api/file/update/:id', upload.single('file'), controller.updateFile)

};
