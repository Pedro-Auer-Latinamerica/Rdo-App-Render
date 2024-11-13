$(document).ready(function () {
  const inputHorarioTrabalho = $("#horario_trabalho");
  const inputHorarioInicio = $("#horario_inicio");
  const inputHorarioTermino = $("#horario_termino");
  const btnRegistrar = $("#registrar_horarios");

  btnRegistrar.on("click", function () {
    const horarioInicio = inputHorarioInicio.val();
    const horarioTermino = inputHorarioTermino.val();

    if (horarioInicio && horarioTermino) {
      // Formatar os horários no formato desejado
      const horarioFormatado = `${horarioInicio} às ${horarioTermino} hs`;
      inputHorarioTrabalho.val(horarioFormatado); // Exibe o horário formatado no campo de texto
      alert(`Horários registrados: ${horarioFormatado}`);
    } else {
      alert("Por favor, preencha os horários de início e término.");
    }
  });
});
