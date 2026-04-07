import { DataTypes, Model } from 'sequelize';

class workoutTrackerDB extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                workoutType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                duration: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                distance: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                rpe: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                notes: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'WorkoutTracker',
            }
        );
    }
}

// class _workoutTrackerModel {
//     static workoutid = 1;

//     constructor() {
//         this.workouts = [];
//     }

//     async create(workout) {
//         workout.id = _InMemoryTaskModel.workoutid++;
//         this.workouts.push(workout);
//         return workout;
//     }

//     async read(id = null) {
//         if (id) {
//             return this.workouts.find((workout) => workout.id === id);
//         }

//         return this.workouts;
//     }

//     async update(workout) {
//         const index = this.workouts.findIndex((t) => t.id === workout.id);
//         this.workouts[index] = workout;
//         return wokrout;
//     }

//     async delete(workout = null) {
//         if (workout === null) {
//             this.workouts = [];
//             return;
//         }

//         const index = this.workouts.findIndex((t) => t.id === workout.id);
//         this.workouts.splice(index, 1);
//         return workout;
//     }
// }

// const workoutTrackerModel = new _workoutTrackerModel();

// workoutTrackerModel.create({ date: "2023-10-01", workoutType: "Run", duration: 30, distance: 5, rpe: 7, notes: "Note" });
// workoutTrackerModel.create({ date: "2023-10-02", workoutType: "Swim", duration: 45, distance: 2, rpe: 8, notes: "Note" });
// workoutTrackerModel.create({ date: "2023-10-03", workoutType: "Bike", duration: 60, distance: 20, rpe: 6, notes: "Note" });

// export default workoutTrackerModel;
export default workoutTrackerDB;
