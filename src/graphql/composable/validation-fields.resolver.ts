import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import schemaValidation from '../validation/schema-validation'
import { customErrorValidation } from '../../utils/utils';

export const validationFieldsResolver: ComposableResolver<any, ResolverContext> =
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
        return async (parent, args, context: ResolverContext, info) => {
            await schemaValidation(info.fieldName)
                .then((allSchema) => allSchema.validate(args, { abortEarly: false })
                    .catch((err) => {
                        var messageErrors = err.errors.map(error => {
                            var msgs = error.split('|')

                            return {
                                'fieldNameError': msgs[1].trim(),
                                'fieldMessageError': msgs[0].trim()
                            }
                        })
                        throw new customErrorValidation(messageErrors);
                    })
                )

            return resolver(parent, args, context, info)
        };
    };