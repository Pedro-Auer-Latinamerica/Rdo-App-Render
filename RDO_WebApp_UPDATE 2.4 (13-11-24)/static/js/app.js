document.addEventListener("DOMContentLoaded", function () {
  console.log("jQuery version:", $.fn.jquery); // Verifica se jQuery está carregado
  console.log("Timepicker available:", typeof $.fn.timepicker !== "undefined"); // Verifica se timepicker está carregado

  const clienteInput = document.getElementById("cliente"); // Recebe o nome do cliente
  const diaInput = document.getElementById("dia"); // Recebe o campo de dia

  // Seleciona o campo de entrada pelo ID
  const contratoField = document.getElementById("contrato");
  let generatingInterval;

  // Função para gerar um dígito aleatório de 0 a 9
  function generateRandomDigit() {
    return Math.floor(Math.random() * 10);
  }

  // Função para iniciar a geração de números gradualmente até 10 dígitos
  function startGeneratingNumber() {
    contratoField.value = ""; // Limpa o campo inicialmente
    clearInterval(generatingInterval); // Garante que nenhum intervalo anterior esteja ativo

    generatingInterval = setInterval(() => {
      if (contratoField.value.length < 10) {
        contratoField.value += generateRandomDigit(); // Adiciona um dígito
      } else {
        clearInterval(generatingInterval); // Para a geração ao atingir 10 dígitos
      }
    }, 100); // Intervalo de 100ms para adicionar cada dígito
  }

  // Evento de clique para iniciar a geração gradual de números
  contratoField.addEventListener("click", function () {
    if (!contratoField.value) {
      startGeneratingNumber();
    }
  });

  // Evento para validar o número ao perder o foco
  contratoField.addEventListener("blur", function () {
    // Verifica se o valor digitado possui exatamente 10 dígitos; se não, gera um novo número completo
    if (!/^\d{10}$/.test(contratoField.value)) {
      contratoField.value = generateRandomNumber();
    }
  });

  // Seleciona todos os campos com a classe "incremental-input"
  const fields = document.querySelectorAll(".incremental-input");

  fields.forEach((field) => {
    // Define o valor mínimo para 1 e ajusta automaticamente se o valor for menor
    field.addEventListener("input", function () {
      const currentValue = parseInt(field.value, 10);
      field.value = currentValue < 1 ? 1 : currentValue;
    });

    // Variável para armazenar o intervalo de incremento
    let incrementInterval;

    // Função para iniciar o incremento contínuo
    function startIncrementing() {
      incrementInterval = setInterval(() => {
        const currentValue = parseInt(field.value, 10) || 0;
        field.value = currentValue + 1; // Incrementa o valor continuamente
      }, 1000); // Ajuste o tempo em milissegundos conforme necessário
    }

    // Inicia o incremento contínuo ao focar no campo
    field.addEventListener("focus", startIncrementing);

    // Para o incremento ao perder o foco
    field.addEventListener("blur", function () {
      clearInterval(incrementInterval);
    });
  });

  // Função para calcular os dias de aluguel entre as datas
  function calcularDiasAluguel(dataInicio, dataTermino) {
    const inicio = new Date(dataInicio);
    const termino = new Date(dataTermino);

    if (inicio && termino && termino >= inicio) {
      const diffTime = Math.abs(termino - inicio);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // Adiciona o evento de cálculo de dias de aluguel em todos os campos de data de término
  document.querySelectorAll(".data-termino").forEach((terminoField, index) => {
    terminoField.addEventListener("change", function () {
      const inicioField = document.getElementById(`data_inicio_${index + 1}`);
      const totalDiasField = document.getElementById(`total_dias_${index + 1}`);

      const dias = calcularDiasAluguel(inicioField.value, terminoField.value);
      totalDiasField.value = dias;
    });
  });

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

        // Alerta de confirmação de download
        alert("Download concluído com sucesso!");
      })
      // Alerta de error ao fazer o download
      .catch((error) => {
        console.error("Erro:", error);
        alert("Houve um erro ao enviar o formulário. Tente novamente.");
      });
  });
});
