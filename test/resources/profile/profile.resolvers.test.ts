import * as jwt from 'jsonwebtoken';

import { app, db, chai, handleError, expect, destroyAll } from './../../test-utils';
import { JWT_SECRET } from '../../../src/utils/utils';
import { UserInstance } from '../../../src/models/UserModel';

describe('Profile - Resolvers', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let userId: number;
    let token: string;

    let withoutProfileUserId: number;
    let withoutProfileUserToken: string;

    let temporaryUserId: number;
    let temporaryUserToken: string;

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
            },
            {
                username: "user test3",
                email: 'teste3@email.com',
                password: '3333'
            }], { returning: true })

            .then((user: UserInstance[]) => {
                userId = user[0].get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);

                withoutProfileUserId = user[1].get('id');
                const withoutProfilePayload = { sub: withoutProfileUserId };
                withoutProfileUserToken = jwt.sign(withoutProfilePayload, JWT_SECRET);

                temporaryUserId = user[2].get('id');
                const temporaryPayload = { sub: temporaryUserId };
                temporaryUserToken = jwt.sign(temporaryPayload, JWT_SECRET);
            })
            .then(() => {
                db.User.destroy({
                    where: {
                        username: "user test3"
                    }
                })
            })
            .then(() => db.Profile.bulkCreate([
                {
                    name: "Profile ADM",
                    fk_user: userId
                },
                {
                    name: "Profile Simple",
                    fk_user: userId
                },
                {
                    name: "Profile Guest",
                    fk_user: userId
                }
            ], { returning: true }))
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

        //#region -- currentProfile --

        describe('currentProfile', () => {

            //#region -- Should return the current Profile by Token --

            it('Should return the current Profile by Token', () => {
                let body = {
                    query: `
                    query {
                        currentProfile {
                            id
                            name
                        }
                    }`
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const singleProfile = res.body.data.currentProfile;
                        expect(res.body.data).to.be.an('object');
                        expect(singleProfile).to.be.an('object');
                        expect(singleProfile).to.have.keys(['id', 'name']);
                        expect(parseInt(singleProfile.id)).to.be.a('number');
                        expect(singleProfile.name).to.equal('Profile ADM');
                        expect(singleProfile.createdAt).to.be.undefined;
                        expect(singleProfile.updatedAt).to.be.undefined;
                        expect(singleProfile.fk_user).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying to get the Profile of an User without Profile --

            it('Should return an error, trying to get the Profile of an User without Profile', () => {
                let body = {
                    query: `
                    query {
                        currentProfile {
                            id
                            name
                        }
                    }`
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${withoutProfileUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.currentProfile).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: User Profile with id ${withoutProfileUserId} not found`);
                    }).catch(handleError);

            });

            //#endregion

            //#region -- Should return an error, trying to get the Profile of an nonexistent User --

            it('Should return an error, trying to get the Profile of an nonexistent User', () => {
                let body = {
                    query: `
                    query {
                        currentProfile {
                            id
                            name
                        }
                    }`
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.currentProfile).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Cannot read property 'id' of undefined`);
                    }).catch(handleError);

            });

            //#endregion

        })

        //#endregion

    });

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //--------------------------- MUTATIONS  --------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region  -- Mutations --

    describe('Mutations', () => {

        //#region -- updateCurrentProfile --

        describe('updateCurrentProfile', () => {

            //#region -- Should update an existing Profile --

            it('Should update an existing Profile', () => {

                let body = {
                    query: `
                        mutation updateExistingProfile($input: ProfileUpdateInput!) {
                            updateCurrentProfile(input: $input) {
                                name
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
                            name: "profile updated",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const updatedProfile = res.body.data.updateCurrentProfile;
                        expect(updatedProfile).to.be.an('object');
                        expect(updatedProfile).to.have.keys(['name', 'fk_user']);
                        expect(parseInt(updatedProfile.id)).to.be.a('number');
                        expect(updatedProfile.name).to.equal('profile updated');
                        expect(updatedProfile.id).to.be.undefined;
                        expect(updatedProfile.createdAt).to.be.undefined;
                        expect(updatedProfile.updatedAt).to.be.undefined;
                        expect(updatedProfile.fk_user).to.be.an('object');
                        expect(updatedProfile.fk_user).to.have.keys(['id', 'username', 'email']);
                        expect(parseInt(updatedProfile.fk_user.id)).to.be.a('number');
                        expect(updatedProfile.fk_user.username).to.equal('user test1');
                        expect(updatedProfile.fk_user.email).to.equal('teste1@email.com');
                        expect(updatedProfile.fk_user.password).to.be.undefined;
                        expect(updatedProfile.fk_user.createdAt).to.be.undefined;
                        expect(updatedProfile.fk_user.updatedAt).to.be.undefined;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error, trying to update a Profile with a nonexistent User --

            it('Should return an error, trying to update a Profile with a nonexistent User', () => {
                let body = {
                    query: `
                        mutation updateProfile($input: ProfileUpdateInput!) {
                            updateCurrentProfile(input: $input) {
                                name
                            }
                        }
                    `,
                    variables: {
                        input: {
                            name: "fail: profile not updated",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.updateCurrentProfile).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`TypeError: Cannot read property 'id' of undefined`);
                    }).catch(handleError);
            });

            //#endregion

            //#region  -- Should return an error, trying to update the Profile of an User without Profile --

            it('Should return an error, trying to update the Profile of an User without Profile', () => {
                let body = {
                    query: `
                        mutation updateExistingProfile($input: ProfileUpdateInput!) {
                            updateCurrentProfile(input: $input) {
                                name
                            }
                        }
                    `,
                    variables: {
                        input: {
                            name: "fail: profile not updated",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${withoutProfileUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.updateCurrentProfile).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: User Profile with id ${withoutProfileUserId} not found`);
                    }).catch(handleError);
            });

            //#endregion

        });

        //#endregion

    });

    //#endregion



});