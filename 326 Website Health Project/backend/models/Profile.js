import { DataTypes } from "sequelize";

let Profile;

function initProfileModel(sequelize) {
    Profile = sequelize.define("Profile", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Profile;
}

class _SQLiteProfileModel {
    async init(fresh = false, sequelize) {
        if (!Profile) initProfileModel(sequelize);
        await sequelize.sync({ force: fresh });
    }

    async createOrUpdate(profile) {
        const existing = await Profile.findOne();
        if (existing) {
            return await existing.update(profile);
        } else {
            return await Profile.create(profile);
        }
    }

    async read() {
        return await Profile.findOne();
    }

    async delete() {
        await Profile.destroy({ truncate: true });
    }
}

const SQLiteProfileModel = new _SQLiteProfileModel();

export { initProfileModel };
export default SQLiteProfileModel;