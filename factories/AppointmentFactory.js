class AppointmentFactory {

    /*
  CONCEITO DE PADRÃO DE PROJETO FACTORY ________________________________________________
  Responsabilidade de pegar a materia prima (parametros) e produzir objeto final
  CartFactory.Build(produtos, endereco)
  = ShoppingCard(além dos produtos e endereco | total, subtotal, descontos) 
  Produz objetos mais complexos
  */

  Build(simpleAppointment) {
    let day = simpleAppointment.date.getDate() + 1;
    let month = simpleAppointment.date.getMonth() ;
    let year = simpleAppointment.date.getFullYear();

    let hour = Number.parseInt(simpleAppointment.time.split(":")[0]);
    let minutes = Number.parseInt(simpleAppointment.time.split(":")[1]);

    let datePattern = new Date(year, month, day, hour, minutes, 0, 0);

    let appo = {
      id: simpleAppointment.id,
      title: simpleAppointment.name + " - " + simpleAppointment.description,
      start: datePattern,
      end: datePattern,
      notified: simpleAppointment.notified,
      email: simpleAppointment.email
    };

    return appo;
  }
}

module.exports = new AppointmentFactory();
