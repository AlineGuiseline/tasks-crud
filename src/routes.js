import { Database } from './database.js';
import { randomUUID } from 'crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

const formatedDate = new Date().toLocaleDateString('pt-br', { 
    weekday: "short", 
    year: "numeric", 
    month: 'short', 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit"
})

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)

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
                created_at: formatedDate,
                updated_at: formatedDate
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
                updated_at: formatedDate
                // atualiza a data de modificação
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            if(!task) {
                return res.writeHead(404).end()
            }

            const isTaskCompleted = !!task.completed_at
            const completed_at = isTaskCompleted ? null : formatedDate

            database.update('tasks', id, { completed_at })

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
