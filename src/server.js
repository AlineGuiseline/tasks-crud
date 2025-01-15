import http from 'http';
/* import { json } from '../middlewares/json.js'; */

const tasks = []

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    if (method === 'GET' && url === '/tasks') {
        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(tasks))
    }
    
    if (method === 'POST' && url === '/tasks') {
        const { title, description } = req.body
        
        tasks.push({
            id: 1,
            title,
            description,
        })

        return res
        .writeHead(201)
        .end('Tarefa criada')
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
