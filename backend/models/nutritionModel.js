import { DataTypes } from 'sequelize';

let Nutrition;

function initNutritionModel(sequelize) {
  Nutrition = sequelize.define("Nutrition", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    age: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    gender: DataTypes.STRING,
    activityLevel: DataTypes.STRING,
    goalWeight: DataTypes.FLOAT,
    weightChangeRate: DataTypes.FLOAT
  }, {
    timestamps: true
  });

  return Nutrition;
}

class _SQLiteNutritionModel {
  async init(fresh = false, sequelize) {
    if (!Nutrition) initNutritionModel(sequelize);
    await sequelize.sync({ force: fresh });
  }

  async create(nutritionData) {
    return await Nutrition.create(nutritionData);
  }

  async read(id = null) {
    if (id) return await Nutrition.findByPk(id);
    return await Nutrition.findAll();
  }

  async update(nutritionData) {
    const record = await Nutrition.findByPk(nutritionData.id);
    if (!record) return null;
    await record.update(nutritionData);
    return record;
  }

  async delete(record = null) {
    if (record === null) {
      await Nutrition.destroy({ truncate: true });
    } else {
      await Nutrition.destroy({ where: { id: record.id } });
    }
  }
}

const SQLiteNutritionModel = new _SQLiteNutritionModel();

export { initNutritionModel };
export default SQLiteNutritionModel;
