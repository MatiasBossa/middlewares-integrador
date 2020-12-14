const fs = require('fs');
const path = require('path');

const pathUsersJSON = path.resolve(__dirname + '/../database/users.json')
const usersJSON = fs.readFileSync(pathUsersJSON, 'utf-8');
const users = JSON.parse(usersJSON);


module.exports = {
    getAll: () => {
        return users;
    },
    generateNewId: () => {
        
        return users.length == 0 ? 1 : users.pop().id + 1;
    },
    writeNewUser: (newUser) => {
        const newUsers = JSON.stringify( [...users, newUser], null, 2);

        fs.writeFileSync(pathUsersJSON, newUsers);
    }
}