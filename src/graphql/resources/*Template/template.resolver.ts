import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import { DbConnection } from '../../../interfaces/DbConnectionInterface';
import { TemplateInstance } from '../../../models/*TemplateModel';
import { compose } from '../../composable/composable.resolver';
import { authResolver } from '../../composable/auth.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';
import { validationFieldsResolver } from '../../composable/validation-fields.resolver';
import { handleError, throwError } from '../../../utils/utils';
import { DataLoaders } from '../../../interfaces/DataLoadersInterface';
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';


export const templateResolvers = {

    Template: {

        fk_user: (parent, args, { db, dataloaders: { userLoader } }: { db: DbConnection, dataloaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return userLoader
                .load({ key: parent.get('fk_user'), info })
                .catch(handleError)
        }

    },

    Query: {

        template: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            args.id = parseInt(args.id);
            return context.db.Template
                .findById(args.id, {
                    attributes: context.requestedFields.getFields(info, { keep: ['id'] })
                })
                .then((template: TemplateInstance) => {
                    throwError(!template, `Template with id ${args.id} not found`);
                    return template;
                }).catch(handleError);
        }),

        templates: compose(authResolver, verifyTokenResolver)((parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Template
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, { keep: ['id'] })
                }).catch(handleError);
        }),

    },

    Mutation: {

        createTemplate: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            args.input.fk_user = context.authUser.id;
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Template
                    .create(args.input, { transaction: t });
            }).catch(handleError);
        }),

        updateTemplate: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            args.id = parseInt(args.id);
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Template
                    .findById(args.id)
                    .then((template: TemplateInstance) => {
                        throwError(!template, `Template with id ${args.id} not found`);
                        throwError(template.get('fk_user') != context.authUser.id, `Unauthorized! You can only edit Template by yourself`);
                        args.input.fk_user = context.authUser.id;
                        return template.update(args.input, { transaction: t });
                    });
            })
            .catch(handleError);
        }),

        deleteTemplate: compose(authResolver, verifyTokenResolver, validationFieldsResolver)((parent, args, context: ResolverContext, info) => {
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Template
                    .findById(args.id)
                    .then((template: TemplateInstance) => {
                        throwError(!template, `Template with id ${args.id} not found`);
                        return template.destroy({ transaction: t })
                            .then((template: TemplateInstance | any) => !!template);
                    });
            }).catch(handleError);
        })

    }
};