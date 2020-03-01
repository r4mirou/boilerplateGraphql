import * as Sequelize from 'sequelize';
import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export interface UserAttributes {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    createdAt?: string;
    updateAt?: string;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
    isPassword(encodedPassword: string, password: string): boolean;
}

export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInstance, UserAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {

    const User: UserModel =
        sequelize.define('User',{
            id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username:{
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },
            email:{
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true
            },
            password:{
                type: DataTypes.STRING(1024),
                allowNull: false,
                //error! search how use
                // validate: {
                //     noEmpty: true
                // }
            }
        },
        {
            tableName: 'users',
            hooks: {
                beforeCreate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                    const salt = genSaltSync();
                    user.password = hashSync(user.password, salt);
                },
                beforeUpdate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                    if(user.changed('password'))
                    {
                        const salt = genSaltSync();
                        user.password = hashSync(user.password, salt);
                    }
                }
            }
        });

        User.prototype.isPassword = (encodedPassword: string, password: string): boolean => {
            return compareSync(password, encodedPassword);
        }

    return User;
}