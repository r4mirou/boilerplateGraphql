import * as jwt from 'jsonwebtoken';
import {
    app,
    db,
    chai,
    handleError,
    expect,
    destroyAll
} from '../../../test/test-utils';
import { UserInstance } from '../../../src/models/UserModel';
import { JWT_SECRET } from '../../../src/utils/utils';
import { TemplateInstance } from '../../../src/models/*TemplateModel';


describe('Template - Fields Validations', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let userId: number;
    let token: string;

    let templateId: number;

    beforeEach(async () => {
        return await db.User.bulkCreate([
            {
                username: "user test1",
                email: 'teste1@email.com',
                password: '123456'
            }
        ], { returning: true })
            .then((user: UserInstance[]) => {
                userId = user[0].get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);
            })
            .then(() => db.Template.bulkCreate([
                {
                    fk_user: userId,
                    description: 'template 1'
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
    //-------------------------- VALIDATIONS  -------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Validations --

    //#region -- description --
    describe('description', () => {

        //#region -- Should return errors, trying to update the Template sending empty Description --

        it('Should return errors, trying to update the Template sending empty Description', () => {
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
                        description: ''
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
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`description`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo descrição não pode estar vazio.`);
                    expect(errors.message[1].fieldNameError).to.equal(`description`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo descrição não atinge o tamanho mínimo de 1 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying to update the Template sending long Description --

        it('Should return an error, trying to update the Template sending long Description', () => {
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
                        description: 'Lorem ipsum at per adipiscing faucibus fringilla convallis sem dapibus, lacus suspendisse fusce per urna volutpat sagittis aliquam semper interdum, eget facilisis auctor consectetur egestas curabitur torquent auctor. proin luctus scelerisque lacus magna taciti eleifend faucibus mi augue dictum, mollis ultricies ligula scelerisque justo himenaeos amet inceptos faucibus, sit tempor mauris sapien lacus dolor posuere sagittis tortor. molestie nec eget turpis aliquam tempus eleifend volutpat pharetra sociosquewss'
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
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`description`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo descrição excede o tamanho limite de 512 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying to update Template sending null Description --

        it('Should return an error, trying to update Template sending null Description', () => {
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
                        description: null
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
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$input" got invalid value`);
                }).catch(handleError);
        });

        //#endregion

    });
    //#endregion

    //#endregion
});