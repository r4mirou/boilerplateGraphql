import { merge } from 'lodash';

import userSchema from '../resources/user/user.validation';
import profileSchema from '../resources/profile/profile.validation';
import tokenSchema from '../resources/token/token.validation';
import templateSchema from '../resources/*Template/template.validation';

export default async inputMethod => {

    var allSchema = await merge(
        tokenSchema,
        userSchema,
        profileSchema,
        templateSchema
    );

    return allSchema[inputMethod].schema
}