const DB = require("mongoose");

const APPOINTMENT_SCHEMA = require("../schema/Appoitement");
const APPOINTMENT_MODEL = DB.model("Appointment", APPOINTMENT_SCHEMA);
const APPOINTMENT_FACTORY = require("../factories/AppointmentFactory");

const MAILER = require("nodemailer");


class AppointmentService {
  async Create(name, email, description, cpf, date, time, finished) {
    let new_appointment = new APPOINTMENT_MODEL({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified: false,
    });

    try {
      await new_appointment.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async GetAll(showFinished) {
    if (showFinished) {
      return await APPOINTMENT_MODEL.find();
    } else {
      try {
        let appos = await APPOINTMENT_MODEL.find({ finished: false });
        let appointments = [];
        appos.forEach((appointment) => {
          // if (appointment.date == undefined) {
          appointments.push(APPOINTMENT_FACTORY.Build(appointment));
          // }
        });
        return appointments;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async GetById(id) {
    try {
      let event = await APPOINTMENT_MODEL.findOne({ _id: id });
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  async Finish(id) {
    try {
      await APPOINTMENT_MODEL.findByIdAndUpdate(id, {
        finished: true,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async Search(query){
    try {
      let appos = await APPOINTMENT_MODEL.find({
      }).or([{name: {$regex: query, $options: 'i'}},{email: {$regex: query, $options: 'i'}}, {cpf: {$regex: query, $options: 'i'}}])
    return appos

    } catch (error) {
      console.log(err);
      return [];
    }
  }

  async sendNotification(){
    let transporter = MAILER.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "aeddec9e0ae814",
        pass: "6ac123dc17c981"
      }
    });
    let appos = await this.GetAll(false);
    appos.forEach(async app => {
      let date = app.start.getTime();
      let hour = 1000 * 60 * 60 * 12;
      let gap = date - Date.now();

      if(gap <= hour){
        if(!app.notified){
          await APPOINTMENT_MODEL.findByIdAndUpdate(app.id, {notified: true})

          transporter.sendMail({
            from: "Leonardo Santos <leonardo@programador.com.br>",
            to: app.email,
            subject: "Sua consulta está próxima!",
            html: "<h1>Consulta</h1><hr>Sua consulta acontece dentro das próximas 12 horas."
          }).then(()=> {
            console.log("Email enviado!")
          }).catch(err=> {
            console.log(err)
          })
        }
      }

    })
  }
}

module.exports = new AppointmentService(); // criar objeto automaticamente a partir de require
