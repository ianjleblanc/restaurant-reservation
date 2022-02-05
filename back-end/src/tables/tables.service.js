const knex = require("../db/connection");

async function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

async function update(reservation_id, table_id) {
    return knex("tables")
        .where({table_id})
        .update({reservation_id})
        .returning("*")
        .then(table => table[0])
}

async function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then(tables => tables[0]);
}

async function read(table) {
    return knex("tables")
        .select("*")
        .where("table_id")
        .first()
}

module.exports = {
    list,
    read,
    update,
    create,
    
}