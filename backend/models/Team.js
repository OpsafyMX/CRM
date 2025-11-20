import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    parent_team_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'For hierarchical team structure',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'teams',
});

export default Team;
