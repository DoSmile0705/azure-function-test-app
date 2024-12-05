const { app } = require('@azure/functions');
const fs = require('fs');
const path = require('path');

const mockTasks = [
    { id: 1, title: 'Task 1', assignedTo: 'user1' },
    { id: 2, title: 'Task 2', assignedTo: 'admin' },
    { id: 3, title: 'Task 3', assignedTo: 'user2' },
    { id: 4, title: 'Task 4', assignedTo: 'user1' },
    { id: 5, title: 'Task 5', assignedTo: 'user2' },
    { id: 6, title: 'Task 6', assignedTo: 'user2' }
];

app.http('tasks', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Handle preflight OPTIONS request
        if (request.method === 'OPTIONS') {
            return {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true'
                }
            };
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Credentials': 'true'
                },
                body: 'Authorization header missing'
            };
        }

        const token = authHeader.split(' ')[1];
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));
        const user = users.find(u => u.token === token);

        if (!user) {
            return {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Credentials': 'true'
                },
                jsonBody: { error: 'Invalid token' }
            };
        }

        let tasks = [];
        if (user.role === 'Admin') {
            tasks = mockTasks;
        } else {
            tasks = mockTasks.filter(task => task.assignedTo === user.username);
        }

        return {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            jsonBody: tasks
        };
    }
});