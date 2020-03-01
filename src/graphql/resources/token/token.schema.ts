const tokenTypes = `
    type Token {
        token: String!
    }
`;

const tokenMutations = `
    createToken(login: String!, password: String!): Token
`;

export {
    tokenTypes,
    tokenMutations
}