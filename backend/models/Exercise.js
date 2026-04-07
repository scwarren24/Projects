import { DataTypes, Model } from 'sequelize';

export default class Exercise extends Model {
  static initModel(sequelize) {
    Exercise.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON, // Array of strings like ["chest", "easy", "strength", "pb:100"]
        allowNull: false,
      },
      videoURL: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    }, {
      sequelize,
      modelName: 'Exercise',
    });
  }
}
