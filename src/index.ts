import * as http from 'http';
import app from './app';
import db from './models';

const port =   3000;
const server = http.createServer(app);

db.sequelize.sync({ force: false })
    .then(() => {
        server.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });

