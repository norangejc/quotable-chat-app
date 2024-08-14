const validator = require("validator");

const validateParam = async (id, schema) => {
  if (!validator.isMongoId(id)) {
    throw new AppError("The value is not a Mongo ID", 400);
  }
  const data = await schema.findById(id);
  if (!data) {
    throw new AppError("No data found with that ID", 404);
  }
  return data;
};

module.exports = { validateParam };
