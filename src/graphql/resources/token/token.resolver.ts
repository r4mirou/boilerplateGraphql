import * as jwt from 'jsonwebtoken';

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { JWT_SECRET } from '../../../utils/utils';
const { Op } = require("sequelize");

import { compose } from '../../composable/composable.resolver';
import { validationFieldsResolver } from '../../composable/validation-fields.resolver';

export const tokenResolvers = {
    Mutation: {
        createToken: compose(validationFieldsResolver)((parent, args, { db }: { db: DbConnection }) => {
            return db.User.findOne({
                where: {
                    [Op.or]: [
                        { email: args.login },
                        { username: args.login }
                    ]
                }, attributes: ['id', 'password']
            }).then((user: UserInstance) => {
                let errorMessage: string = 'Unauthorized, wrong email/username or password!';
                if (!user || !user.isPassword(user.get('password'), args.password)) { throw new Error(errorMessage); }

                const payload = { sub: user.get('id') };

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                };
            });
        })
    }
};