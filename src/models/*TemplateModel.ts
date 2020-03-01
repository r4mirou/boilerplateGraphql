import * as Sequelize from 'sequelize';
import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface TemplateAttributes {

    id?: number;
    fk_user?:number;
    description?: string;
    createdAt?: string;
    updateAt?: string;
}

export interface TemplateInstance extends Sequelize.Instance<TemplateAttributes> {}

export interface TemplateModel extends BaseModelInterface, Sequelize.Model<TemplateInstance, TemplateAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): TemplateModel => {

    const Template: TemplateModel = sequelize.define('Template',{

        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description:{
            type: DataTypes.STRING(1024),
            allowNull: true
        },
    },
    {
        tableName: 'Templates',
    });

    Template.associate = (models: ModelsInterface): void => {
        Template.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'fk_user',
                name: 'fk_user',
            }
        });
    }

    return Template;
}