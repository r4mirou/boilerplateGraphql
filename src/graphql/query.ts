import { profileQueries } from './resources/profile/profile.schema';
import { templateQueries } from './resources/*Template/template.schema';
import { userQueries } from './resources/user/user.schema';

const Query = `
    type Query {
        ${profileQueries}
        ${templateQueries}
        ${userQueries}
    }

`;

export {
    Query
}