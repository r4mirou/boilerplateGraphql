import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import { DbConnection } from '../../../interfaces/DbConnectionInterface';
import { ProfileInstance } from '../../../models/ProfileModel';
import { compose } from '../../composable/composable.resolver';
import { authResolver } from '../../composable/auth.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';
import { validationFieldsResolver } from '../../composable/validation-fields.resolver';
import { handleError, throwError } from '../../../utils/utils';
import { DataLoaders } from '../../../interfaces/DataLoadersInterface';
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';


export const profileResolvers = {

    Profile: {

        fk_user: (parent, args, { db, dataloaders: { userLoader } }: { db: DbConnection, dataloaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return userLoader
                .load({ key: parent.get('fk_user'), info })
                .catch(handleError)
        }

    },

    Query: {

        currentProfile: compose(authResolver, verifyTokenResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.Profile
                .findOne({ where: { fk_user: context.authUser.id },
                    attributes: context.requestedFields.getFields(info, { keep: ['id'] })
                })
                .then((profile: ProfileInstance) => {
                    throwError(!profile, `User Profile with id ${context.authUser.id} not found`);
                    return profile;
                }).catch(handleError);
        }),

    },

    Mutation: {

        updateCurrentProfile: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Profile
                    .findOne({ where: { fk_user: context.authUser.id } })
                    .then((profile: ProfileInstance) => {
                        throwError(!profile, `User Profile with id ${context.authUser.id} not found`);
                        throwError(profile.get('fk_user') != context.authUser.id, `Unauthorized! You can only edit Profile by yourself`);
                        args.input.fk_user = context.authUser.id;
                        return profile.update(args.input, { transaction: t });
                    });
            }).catch(handleError);
        }),

    }
};