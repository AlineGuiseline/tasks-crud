import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table) {
        const data = this.#database[table] ?? []

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data) {
        // table: nome da tabela (tasks) | id: do item a ser atualizado | data: objeto contendo os novos valores
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        // procura no banco de dados (this.#database[table]) o índice da linha onde id corresponde
        // ao da tarefa
    
        if (rowIndex > -1) {
            // se encontrou a tarefa (rowIndex > -1), faz a atualização
            const row = this.#database[table][rowIndex]
            // pega os dados antigos da tarefa
            this.#database[table][rowIndex] = { id, ...row, ...data }
            // cria um novo objeto mesclando: id (mantém o mesmo) | ...row (mantém os dados antigos) | ...data (sobrescreve com os novos dados enviados)
            this.#persist()
            // salva as alterações no banco de dados
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
        if (rowIndex > -1) {
          this.#database[table].splice(rowIndex, 1)
          this.#persist()
        }
    }
}