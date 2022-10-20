const db = require("../models")
const File = db.file

exports.upload = (req, res, next) => {
     const file = req.file

     File.create({
        name: file.originalname,
        format: file.encoding,
        MIME_type: file.mimetype,
        size: file.size,
        path: file.path
    }).then(() => res.status(200).send({
        message: "File created successfully!",
        file: `http://localhost:3000/${file.path}`
    }))
     .catch(err => res.status(500).send({ message: err.message }))
}

exports.getList = (req, res) => {
    const list_size = req.query.list_size || 10
    const page = req.query.page || 1
    File.findAll({ offset: list_size * (page - 1), limit: list_size }).then(files => {
        res.status(200).send(files)
    })
     .catch(err => res.status(500).send({ message: err.message }))
}

exports.getFile = (req, res) => {
    File.findOne({
        where: {
            id: req.params.id
        }
     }).then(file => {
        res.status(200).send(file)
    })
     .catch(err => res.status(500).send({ message: err.message }))
}

exports.downloadFile = (req, res) => {
    File.findOne({
        where: {
            id: req.params.id
        }
    }).then(file => {
        res.download(file.path)
    })
     .catch(err => res.status(500).send({ message: err.message }))
}

exports.updateFile = (req, res) => {
    File.update(
        {
            name: req.file.originalname,
            format: req.file.encoding,
            MIME_type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        },
        { where: { id: req.params.id } }
    ).then(() => res.status(200).send({
              message: "File updated successfully!",
              file: `http://${process.env.APP_ADDRESS || 'localhost'}:${process.env.APP_PORT || 3000}/${req.file.path}`
          }))
       .catch(err => res.status(500).send({ message: err.message }))
}

exports.remove = (req, res) => {
    File.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.status(204).send({ message: "File Deleted!" })
    })
     .catch(err => res.status(500).send({ message: err.message }))
}
