const templateTypes = `
    type Template {
        id: ID!
        description: String!
        createdAt: String!
        updatedAt: String!
        fk_user: User!
    }

    input TemplateCreateInput {
        description: String!
    }

    input TemplateUpdateInput {
        description: String!
    }
`;

const templateQueries = `
    template(id: ID!): Template
    templates(first: Int, offset: Int): [Template!]!
`;

const templatetMutations = `
    createTemplate(input: TemplateCreateInput!): Template!
    updateTemplate(id: ID!, input: TemplateUpdateInput!): Template!
    deleteTemplate(id: ID!): Boolean
`;

export {
    templateTypes,
    templateQueries,
    templatetMutations
}