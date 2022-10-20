module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define("files", {
    name: {
      type: Sequelize.STRING
    },
    format: {
        type: Sequelize.STRING
    },
    MIME_type: {
        type: Sequelize.STRING
    },
    size: {
        type: Sequelize.INTEGER
    },
    path: {
        type: Sequelize.STRING
    }
  });

  return File;
};
