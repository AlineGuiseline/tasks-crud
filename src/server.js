import http from 'http';
import { json } from './middlewares/json.js';
import { Database } from './database.js';

const database = new Database();

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)

    if (method === 'GET' && url === '/tasks') {
        const tasks = database.select('tasks')

        return res.end(JSON.stringify(tasks))
    }
    
    if (method === 'POST' && url === '/tasks') {
        const { title, description } = req.body

        const task = {
            id: 1,
            title,
            description,
        }

        database.insert('tasks', task)

        return res
        .writeHead(201)
        .end()
    }
    return res.end('Hello world');
});

server.listen(3333);

/* 
- `id
Identificador único de cada task
- `title`
Título da task
- `description`
Descrição detalhada da task
- `completed_at`
Data de quando a task foi concluída. O valor inicial deve ser `null`
- `created_at
Data de quando a task foi criada.
- `updated_at`
Deve ser sempre alterado para a data de quando a task foi atualizada.
 */
