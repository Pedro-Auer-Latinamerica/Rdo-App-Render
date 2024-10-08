document.addEventListener("DOMContentLoaded", function () {
  console.log("jQuery version:", $.fn.jquery); // Verifica se jQuery está carregado
  console.log("Timepicker available:", typeof $.fn.timepicker !== "undefined"); // Verifica se timepicker está carregado
  const clienteInput = document.getElementById("cliente"); // Recebe o nome do cliente

  const form = document.querySelector("form");

  // Inicializar Datepicker
  $(".datepicker").datepicker({
    dateFormat: "dd/mm/yy",
    changeMonth: true,
    changeYear: true,
  });

  // Inicializar Timepicker
  $(".timepicker").timepicker({
    timeFormat: "HH:mm:ss",
    interval: 60,
    minTime: "00",
    maxTime: "18:00",
    defaultTime: "00", // Horário inicial padrão
    startTime: "08:00", // Hora de início
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    // Enviar o formulário via AJAX
    fetch("/submit", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.blob(); // Receber o arquivo Excel como blob
        } else {
          throw new Error("Falha no envio do formulário.");
        }
      })
      .then((blob) => {
        // Criar um link para baixar o arquivo Excel
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        // Puxar o nomde do cliente do input
        const nomeCliente = clienteInput.value.trim(); // 'cliente';
        // Usa 'cliente' como padrão se vazio
        a.href = url;
        a.download = `RDO_${nomeCliente}.xlsx`; // Nome do arquivo baixado
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Houve um erro ao enviar o formulário. Tente novamente.");
      });
  });
});
