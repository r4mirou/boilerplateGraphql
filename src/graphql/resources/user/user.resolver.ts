import { Transaction } from 'sequelize';

import { authResolver } from '../../composable/auth.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';
import { validationFieldsResolver } from '../../composable/validation-fields.resolver';

import { UserInstance } from '../../../models/UserModel';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { ProfileInstance } from '../../../models/ProfileModel';


export const userResolvers = {
    Query: {
        currentUser: compose(authResolver, verifyTokenResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.User
                .findById(context.authUser.id, {
                    attributes: context.requestedFields.getFields(info, { keep: ['id'] })
                })
                .then((user: UserInstance) => {
                    throwError(!user, `User with id ${context.authUser.id} not found`);
                    return user;
                }).catch(handleError);
        })
    },

    Mutation: {

        //create user and profile
        createUser: compose(validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.User
                    .create(args.input, { transaction: t })
                    .then((user: UserInstance) => {
                        context.db.sequelize.transaction((t: Transaction) => {
                            return context.db.Profile
                                .create({
                                    fk_user: user.get('id'),
                                    name: user.get('username')
                                }, { transaction: t });
                        });
                        return user;
                    });
            }).catch(handleError);
        }),

        updateCurrentUser: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.User
                    .findById(context.authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id ${context.authUser.id} not found`);
                        return user.update(args.input, { transaction: t });
                    });
            }).catch(handleError);
        }),

        updateCurrentUserPassword: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.User
                    .findById(context.authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id ${context.authUser.id} not found`);
                        return user.update(args.input, { transaction: t })
                            .then((user: UserInstance) => !!user);
                    });
            })
                .catch(handleError);
        }),

        //delete user and profile
        deleteCurrentUser: compose(authResolver, verifyTokenResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Profile
                    .findOne({ where: { fk_user: context.authUser.id } })
                    .then((profile: ProfileInstance) => {
                        throwError(!profile, `User with id ${context.authUser.id} not found in profiles`);
                        return profile.destroy({ transaction: t })
                            .then((profile: ProfileInstance | any) => !!profile);
                    })
                    .then(() => {
                        return context.db.User
                            .findById(context.authUser.id)
                            .then((user: UserInstance) => {
                                throwError(!user, `User with id ${context.authUser.id} not found`);
                                return user.destroy({ transaction: t })
                                    .then((user: UserInstance | any) => !!user);
                            });
                    });
            })
                .catch(handleError);
        })
    }
};