const knex = require("../db/connection");

async function list(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({reservation_date: reservation_date})
        .orderBy("reservation_time");
        
}

async function create(reservation) {
   return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then(reservations => reservations[0]);

}


module.exports = {
    list,
    create,
}