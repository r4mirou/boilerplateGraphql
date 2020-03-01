import * as jwt from 'jsonwebtoken';
import { app, db, chai, handleError, expect, destroyAll } from './../../test-utils';
import { TemplateInstance } from '../../../src/models/*TemplateModel';
import { JWT_SECRET } from '../../../src/utils/utils';
import { UserInstance } from '../../../src/models/UserModel';

describe('Template - Resolvers', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let userId: number;
    let token: string;

    let unauthorizedId: number;
    let unauthorizedToken: string;

    let templateId: number;
    const nonexistentTemplateId: number = 123;

    beforeEach(async () => {
        return await db.User.bulkCreate([
            {
                username: "user test1",
                email: 'teste1@email.com',
                password: '12345'
            },
            {
                username: "user test2",
                email: 'teste2@email.com',
                password: '54321'
            }], { returning: true })
            .then((user: UserInstance[]) => {
                userId = user[0].get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);

                unauthorizedId = user[1].get('id');
                const unauthorizedPayload = { sub: unauthorizedId };
                unauthorizedToken = jwt.sign(unauthorizedPayload, JWT_SECRET);
            })
            .then(() => db.Template.bulkCreate([
                {
                    fk_user: userId,
                    description: 'template 1'
                },
                {
                    fk_user: userId,
                    description: 'template 2'
                },
                {
                    fk_user: userId,
                    description: 'template 3'
                }
            ], { returning: true }))
            .then((template: TemplateInstance[]) => {
                templateId = template[0].get('id');
            });
    });

    afterEach(async () => {
        await destroyAll();
    });

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //---------------------------- QUERIES  ---------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Queries --

    describe('Queries', () => {

        //#region -- template --

        describe('template', () => {

            //#region -- Should return a especific Template by Id --

            it('Should return a especific Template by Id', () => {
                let body = {
                    query: `
                        query findOneTemplate ($id: ID!) {
                            template (id: $id) {
                                id
                                description
                            }
                        }
                    `,
                    variables: {
                        id: templateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const singleTemplate = res.body.data.template;
                        expect(res.body.data).to.be.an('object');
                        expect(singleTemplate).to.be.an('object');
                        expect(singleTemplate).to.have.keys(['id', 'description']);
                        expect(parseInt(singleTemplate.id)).to.be.a('number');
                        expect(singleTemplate.description).to.equal('template 1');
                        expect(singleTemplate.createdAt).to.be.undefined;
                        expect(singleTemplate.updatedAt).to.be.undefined;
                        expect(singleTemplate.fk_user).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying get a Template with a nonexistent Id --

            it('Should return an error, trying get a Template with a nonexistent Id', () => {
                let body = {
                    query: `
                        query errorFindTemplate ($id: ID!) {
                            template (id: $id) {
                                id
                                description
                            }
                        }
                    `,
                    variables: {
                        id: nonexistentTemplateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.template).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: Template with id ${nonexistentTemplateId} not found`);
                    }).catch(handleError);
            });

            //#endregion

        })

        //#endregion

        //#region -- templates --

        describe('templates', () => {

            //#region -- Should return an list whith all Templates --

            it('Should return an list whith all Templates', () => {
                let body = {
                    query: `
                        query {
                            templates {
                                id
                                description
                                fk_user{
                                    id
                                    username
                                    email
                                }
                            }
                        }
                    `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const listTemplates = res.body.data.templates;
                        expect(res.body.data).to.be.an('object');
                        expect(listTemplates).to.be.an('array');
                        expect(listTemplates[0]).to.be.an('object');
                        expect(listTemplates[0]).to.have.keys(['id', 'description', 'fk_user']);
                        expect(parseInt(listTemplates[0].id)).to.be.a('number');
                        expect(listTemplates[0].description).to.equal('template 1');
                        expect(listTemplates[0].createdAt).to.be.undefined;
                        expect(listTemplates[0].updatedAt).to.be.undefined;
                        expect(listTemplates[0].fk_user).to.be.an('object');
                        expect(listTemplates[0].fk_user).to.have.keys(['id', 'username', 'email']);
                        expect(parseInt(listTemplates[0].fk_user.id)).to.be.a('number');
                        expect(listTemplates[0].fk_user.username).to.equal('user test1');
                        expect(listTemplates[0].fk_user.email).to.equal('teste1@email.com');
                        expect(listTemplates[0].fk_user.password).to.be.undefined;
                        expect(listTemplates[0].fk_user.createdAt).to.be.undefined;
                        expect(listTemplates[0].fk_user.updatedAt).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    });

            });

            //#endregion

        });

        //#endregion
    });

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //--------------------------- MUTATIONS  --------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region  -- Mutations --

    describe('Mutations', () => {

        //#region -- createTemplate --

        describe('createTemplate', () => {

            //#region -- Should create a new Template --

            it('Should create a new Template', () => {

                let body = {
                    query: `
                        mutation createNewTemplate ($input: TemplateCreateInput!) {
                            createTemplate(input: $input) {
                                id
                                description
                                fk_user {
                                    id
                                    username
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            description: "template created",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const createdTemplate = res.body.data.createTemplate;
                        expect(res.body.data).to.be.an('object');
                        expect(createdTemplate).to.be.an('object');
                        expect(createdTemplate).to.have.keys(['id', 'description', 'fk_user']);
                        expect(parseInt(createdTemplate.id)).to.be.a('number');
                        expect(createdTemplate.description).to.equal('template created');
                        expect(createdTemplate.createdAt).to.be.undefined;
                        expect(createdTemplate.updatedAt).to.be.undefined;
                        expect(createdTemplate.fk_user).to.be.an('object');
                        expect(createdTemplate.fk_user).to.have.keys(['id', 'username']);
                        expect(parseInt(createdTemplate.fk_user.id)).to.be.a('number');
                        expect(createdTemplate.fk_user.username).to.equal('user test1');
                        expect(createdTemplate.fk_user.email).to.be.undefined;
                        expect(createdTemplate.fk_user.password).to.be.undefined;
                        expect(createdTemplate.fk_user.createdAt).to.be.undefined;
                        expect(createdTemplate.fk_user.updatedAt).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

        });

        //#endregion

        //#region -- updateTemplate --

        describe('updateTemplate', () => {

            //#region -- Should update an existing Template --

            it('Should update an existing Template', () => {

                let body = {
                    query: `
                        mutation updateExistingTemplate($id: ID!, $input: TemplateUpdateInput!) {
                            updateTemplate(id: $id, input: $input) {
                                id
                                description
                                fk_user{
                                    id
                                    username
                                    email
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            description: "template updated"
                        },
                        id: templateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const updatedTemplate = res.body.data.updateTemplate;
                        expect(updatedTemplate).to.be.an('object');
                        expect(updatedTemplate).to.have.keys(['id', 'description', 'fk_user']);
                        expect(parseInt(updatedTemplate.id)).to.be.a('number');
                        expect(updatedTemplate.description).to.equal('template updated');
                        expect(updatedTemplate.createdAt).to.be.undefined;
                        expect(updatedTemplate.updatedAt).to.be.undefined;
                        expect(updatedTemplate.fk_user).to.be.an('object');
                        expect(updatedTemplate.fk_user).to.have.keys(['id', 'username', 'email']);
                        expect(parseInt(updatedTemplate.fk_user.id)).to.be.a('number');
                        expect(updatedTemplate.fk_user.username).to.equal('user test1');
                        expect(updatedTemplate.fk_user.email).to.equal('teste1@email.com');
                        expect(updatedTemplate.fk_user.password).to.be.undefined;
                        expect(updatedTemplate.fk_user.createdAt).to.be.undefined;
                        expect(updatedTemplate.fk_user.updatedAt).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying update a Template with a nonexistent Id --

            it('Should return an error, trying update a Template with a nonexistent Id', () => {
                let body = {
                    query: `
                        mutation updateExistingTemplate($id: ID!, $input: TemplateUpdateInput!) {
                            updateTemplate(id: $id, input: $input) {
                                id
                                description
                                fk_user{
                                    id
                                    username
                                    email
                                }
                            }
                        }
                    `,
                    variables: {
                        id: nonexistentTemplateId,
                        input: {
                            description: "template not updated",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: Template with id ${nonexistentTemplateId} not found`);
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying update a Template with a unauthorized Id --

            it('Should return an error, trying update a Template with a unauthorized Id', () => {
                let body = {
                    query: `
                        mutation updateExistingTemplate($id: ID!, $input: TemplateUpdateInput!) {
                            updateTemplate(id: $id, input: $input) {
                                id
                                description
                                fk_user{
                                    id
                                    username
                                    email
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            description: "template not updated"
                        },
                        id: templateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${unauthorizedToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: Unauthorized! You can only edit Template by yourself`);
                    }).catch(handleError);
            });

            //#endregion
        });

        //#endregion

        //#region -- deleteTemplate --

        describe('deleteTemplate', () => {

            //#region -- Should delete an existing Template --

            it('Should delete an existing Template', () => {

                let body = {
                    query: `

                    mutation deleteExistingTemplate($id: ID!) {
                        deleteTemplate(id: $id)
                    }
                    `,
                    variables: {
                        id: templateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data.deleteTemplate).to.be.true;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying delete a Template with a nonexistent Id --

            it('Should return an error, trying delete a Template with a nonexistent Id', () => {

                let body = {
                    query: `

                    mutation deleteExistingTemplate($id: ID!) {
                        deleteTemplate(id: $id)
                    }
                    `,
                    variables: {
                        id: nonexistentTemplateId
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.deleteTemplate).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: Template with id ${nonexistentTemplateId} not found`);
                    }).catch(handleError);
            });

            //#endregion

        });

        //#endregion

    });

    //#endregion



});