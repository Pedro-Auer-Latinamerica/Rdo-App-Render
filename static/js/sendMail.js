function sendMail() {
  // Alerta de confirmação antes de enviar o email
  const confirmSend = confirm("Deseja realmente enviar o email?");
  if (confirmSend) {
    // Alerta de opção para adiar o envio
    const delaySend = confirm("Deseja adiar o envio do email?");
    if (!delaySend) {
      // Redireciona para o cliente de e-mail se a pessoa optar por enviar agora
      window.location.href = "mailto:someone@example.com";
    } else {
      alert("Envio do email adiado.");
    }
  } else {
    alert("Envio do email cancelado.");
  }
}
