import { DataTypes, Model } from 'sequelize';

class FoodEntry extends Model {
  static initModel(sequelize) {
    FoodEntry.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      foodId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nutData: {
        type: DataTypes.JSON,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'FoodEntry',
      tableName: 'food_entries',
      timestamps: false
    });
  }
}

export default FoodEntry;
