import http from 'http';
import { randomUUID } from 'node:crypto';

const tasks = []

const server = http.createServer((req, res) => {
    const { method, url } = req

    if (method === 'GET' && url === '/tasks') {
        return res
        .end(JSON.stringify(tasks))
    }
    
    if (method === 'POST' && url === '/tasks') {

        tasks.push({
            id: 1,
            title: 'Arrumar a cama',
            description: 'Organizar a cama após acordar',
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
