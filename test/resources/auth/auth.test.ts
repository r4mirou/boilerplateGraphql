import * as jwt from 'jsonwebtoken';
import { app, db, chai, handleError, expect, destroyAll } from './../../test-utils';
import { UserInstance } from '../../../src/models/UserModel';
import { JWT_SECRET } from '../../../src/utils/utils';

describe('Auth - Resolvers', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let token: string;
    let userId: number;

    beforeEach(async () => {
        return await db.User.create(
            {
                username: "user test1",
                email: 'teste1@email.com',
                password: '12345'
            }, { returning: true })
            .then((users: UserInstance) => {
                userId = users.get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);
            });
    });

    afterEach(async () => {
        await destroyAll();
    })

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //------------------------- Authentication  ------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region  -- Authentication Test --

    describe('Authentication', () => {

        //#region -- updateCurrentUser --

        describe('updateCurrentUser', () => {

            //#region -- Should update an existing User --

            it('Should update an existing User', () => {

                let body = {
                    query: `
                        mutation updateExistingUser($input: UserUpdateInput!) {
                            updateCurrentUser(input: $input) {
                                username
                                email
                            }
                        }
                    `,
                    variables: {
                        input: {
                            username: "userUpdated",
                            email: 'updated@email.com',
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const updatedUser = res.body.data.updateCurrentUser;
                        expect(updatedUser).to.be.an('object');
                        expect(updatedUser.username).to.equal('userUpdated');
                        expect(updatedUser.email).to.equal('updated@email.com');
                        expect(updatedUser.id).to.be.undefined;
                    }).catch(handleError);

            });

            //#endregion

            //#region -- Should block operation if token is invalid --

            it('Should block operation if token is invalid', () => {

                let body = {
                    query: `
                        mutation updateExistingUser($input: UserUpdateInput!) {
                            updateCurrentUser(input: $input) {
                                username
                                email
                            }
                        }
                    `,
                    variables: {
                        input: {
                            username: "user updated",
                            email: 'updated@email.com',
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer INVALID_TOKEN`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data.updateCurrentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(res.body.errors).to.be.an('array');
                        expect(res.body.errors[0].message).to.equal('JsonWebTokenError: jwt malformed');
                    }).catch(handleError);

            });

            //#endregion

            //#region -- Should block operation if token is not provide --

            it('Should block operation if token is not provide', () => {

                let body = {
                    query: `
                        mutation updateExistingUser($input: UserUpdateInput!) {
                            updateCurrentUser(input: $input) {
                                username
                                email
                            }
                        }
                    `,
                    variables: {
                        input: {
                            username: "user updated",
                            email: 'updated@email.com',
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer `)
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data.updateCurrentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(res.body.errors).to.be.an('array');
                        expect(res.body.errors[0].message).to.equal('JsonWebTokenError: jwt must be provided');
                    }).catch(handleError);

            });

            //#endregion

        });

        //#endregion


    })

    //#endregion



});