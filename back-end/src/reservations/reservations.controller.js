const service = require("./reservations.service")
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res) {
  const {date} = req.query;
  //mobile_number?
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).send({ data })
}

async function read(req, res) {
  const { reservationId } = req.params
  const data = await service.read(reservationId)
  res.json({data})
}






// ---------- //
// VALIDATION //
// ---------- //

const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

function validDate(req, res, next) {
  const { reservation_date } = req.body.data;
  if(reservation_date && !reservation_date.match(dateFormat)) {
    next({
      status: 400,
      message: "reservation_date must be a date."
    })
  }
  next();
}
function validTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if(reservation_time && !reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: "reservation_time must be a time."
    })
  }
  if (reservation_time < "10:30:00") {
    return next({
      status: 400,
      message: "reservation_time cannot be before 10:30 a.m."
    })
  } 
  if (reservation_time > "21:30") {
    return next({
      status: 400,
      message: "reservation_time must be before 9:30 p.m."
    })
  }
   
  next();
}


function hasData(req, res, next) {
  const data = req.body.data;
  // const {data} = req.body; ?
  if (!data) {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  }
  next();
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

function hasOnlyValidProperties(req, res, next) {
  // iterate through keys in req.body
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  // if there are any invalid fields
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function hasValidPeople(req, res, next) {
  const {
    data: { people },
  } = req.body;

  if (people <= 0 || typeof people !== "number") {
    return next({
      status: 400,
      message: "'people' value must be greater than 0 and be a number",
    });
  }
  next();
}



function checkTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data
  const d = new Date(`${reservation_date} ${reservation_time}`);
  let day = d.getDay()
  if (day === 2) {
    next({
      status: 400,
      message: "Restaurant closed on Tuesdays"
    })
  }
  next()
}

function pastDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data
  const d = new Date(`${reservation_date} ${reservation_time}`);
  let today = new Date()
  if (today > d) {
    next({
      status: 400,
      message: "Only future reservations are allowed."
    })
  }
  next()
}

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


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(reservationExists),
    checkTuesday,
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidPeople,
    validDate,
    validTime,
    pastDate,
    asyncErrorBoundary(create)

  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ]
};
