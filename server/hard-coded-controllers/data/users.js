const { TEMP_USERNAME,  TEMP_PASSWORD } = process.env;

const users = [
    {
        id: 1, 
        username: TEMP_USERNAME,
        password: TEMP_PASSWORD,
    },
];

module.exports = users;