const { app } = require('@azure/functions');
const fs = require('fs');
const path = require('path');

app.http('login', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Handle preflight OPTIONS request
        if (request.method === 'OPTIONS') {
            return {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true'
                }
            };
        }

        const { username, password } = await request.json();
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));

        const user = users.find(u => u.username === username && u.password === password);

        console.log(user);

        if (user) {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json',
                },
                jsonBody: { token: user.token, role: user.role }
            };
        } else {
            return {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'
                },
                jsonBody: { error: 'Invalid credentials' }
            };
        }
    }
});
