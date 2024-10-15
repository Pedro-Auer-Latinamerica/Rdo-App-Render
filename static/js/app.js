document.addEventListener("DOMContentLoaded", function () {
  console.log("jQuery version:", $.fn.jquery); // Verifica se jQuery está carregado
  console.log("Timepicker available:", typeof $.fn.timepicker !== "undefined"); // Verifica se timepicker está carregado

  const clienteInput = document.getElementById("cliente"); // Recebe o nome do cliente
  const diaInput = document.getElementById("dia"); // Recebe o campo de dia

  // Define a data atual no campo "DIA" ao carregar a página
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  diaInput.value = formattedDate;

  const form = document.querySelector("form");

  // Inicializar Datepicker
  $(".datepicker").datepicker({
    dateFormat: "dd/mm/yy",
    changeMonth: true,
    changeYear: true,
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
        // Puxar o nome do cliente do input
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
