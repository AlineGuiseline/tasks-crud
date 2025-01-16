import { Database } from './database.js';
import { randomUUID } from 'crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res
            .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if(!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title is requires' })
                )
            }

            if(!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'description is required' })
                )
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }
    
            database.insert('tasks', task)
    
            return res
            .writeHead(201)
            .end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if(!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title or description are requires '})
                    // se nem title nem description forem enviados, a req é inválida
                )
            }

            const [task] = database.select('tasks', { id })
            // procura no banco de dados por uma tarefa com o id informado
            // [task] usa destructuring para pegar o primeiro item do array retornado (se existir)

            if(!task) {
                return res.writeHead(404).end()
                // se não encontrou a tarefa, retorna um erro 404
            }

            database.update('tasks', id, {
                title: title ?? task.title, 
                // se title for null ou undefined, mantém o título original (task.title)
                description: description ?? task.description,
                // o mesmo vale para description
                updated_at: new Date()
                // atualiza a data de modificação
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
          const { id } = req.params
    
          const [task] = database.select('tasks', { id })
    
          if (!task) {
            return res.writeHead(404).end()
          }

            console.log(task); 

    
          database.delete('tasks', id)
    
          return res.writeHead(204).end()
        }
    },
]

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
