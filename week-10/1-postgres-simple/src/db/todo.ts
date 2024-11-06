import { client } from "..";
/*
 * Function should insert a new todo for this user
 * Should return a todo object
 * {
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }
 */
export async function createTodo(userId: number, title: string, description: string) {
       const result = await client.query(
        `INSERT INTO todos (user_id, title, description, done) values ($1, $2, $3, $4) RETURNING *`,
        [userId, title, description, false]
       );
       return result.rows[0];
}
/*
 * mark done as true for this specific todo.
 * Should return a todo object
 * {
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }
 */
export async function updateTodo(todoId: number) {
       const result = await client.query(
        `UPDATE todos SET done = $2 WHERE id = $1 RETURNING title, description, done, id`,
        [todoId, true]
       );
       return result.rows[0];
}

/*
 *  Get all the todos of a given user
 * Should return an array of todos
 * [{
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }]
 */
export async function getTodos(userId: number) {
    const result = await client.query(
        `SELECT user_id, title, description, done, id FROM todos WHERE user_id = $1`,
        [userId]
       );
       return result.rows
}