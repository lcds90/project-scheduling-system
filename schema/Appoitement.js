const DB = require("mongoose");

const appointment = new DB.Schema({
    name: String,
    email: String,
    description: String,
    cpf: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
});

module.exports = appointment;
