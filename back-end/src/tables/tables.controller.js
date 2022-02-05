const service = require("./tables.service")
// const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
   const data = await service.list()
   res.json({ data })
}

async function create(req, res) {
    const table = req.body.data;
  const data = await service.create(table);
  res.status(201).send({ data })
}



async function update(req, res) {
    const { table_id } = req.params;
    const { reservation_id } = req.body.data;
    data = await service.update(reservation_id, table_id)
    res.json({ data })
}

// ---------- //
// VALIDATION //
// ---------- //

async function reservationExists(req, res, next) {
    const { reservationId } = req.params;
    const reservation = await reservationsService.read(reservationId);
  
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    } else {
      return next({
        status: 404,
        message: `No reservation found for id '${reservationId}'.`,
      });
    }
  } 

function checkData(req, res, next) {
    const { data } = req.body;
    if (!data) {
        next({
            status: 400,
            message: "Data is missing"
        })
    }
    next();
}

function checkTableName(req, res, next) {
    const { table_name } = req.body.data;
    if (!table_name || table_name === "" || table_name.length <= 1) {
        next({
            status: 400,
            message: "table_name is either missing, empty, one character"
        });
    }
    next();
}

function checkCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if (!capacity || capacity <= 0 || typeof capacity != "number") {
        next({
            status: 400,
            message: "The capacity is missing, zero, or not a number."
        });
    }
    next();
}



module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        checkData,
        checkCapacity,
        checkTableName,
        asyncErrorBoundary(create)
    ],
    update: [
        asyncErrorBoundary(reservationExists),
        checkData,
        checkCapacity,
        checkTableName,
        asyncErrorBoundary(update)
    ]
}