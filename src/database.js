import fs from 'node:fs/promises'

/* const databasePath = new URL('../db.json', import.meta.url) */

export class Database {
    #database = {}

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

        return data
    }
}