// Configurações gerais
const EMAIL_JS_CONFIG = {
  publicKey: "s7eWkxR-sAUpWSHJh",
  serviceId: "service_9zcbv3j",
  templateId: "template_s3dukvq",
};
const POPUP_TIMEOUT = 2000; // Tempo em ms para exibir o pop-up

// Inicialize o EmailJS
emailjs.init(EMAIL_JS_CONFIG.publicKey);

// Menu Toggle para Mobile
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("active");
  });
}

// Rolagem suave para links de navegação
const navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetSection = document.querySelector(link.getAttribute("href"));
    targetSection.scrollIntoView({
      behavior: "smooth",
    });
    // Fechar o menu após o clique no mobile
    if (navbar.classList.contains("active")) {
      navbar.classList.remove("active");
      menuIcon.classList.remove("active");
    }
  });
});

// Adicione o evento ao formulário
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const formMessage = document.getElementById("form-message");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    // Reseta classes de erro
    [nameField, emailField, messageField].forEach((field) =>
      field.classList.remove("error")
    );

    // Validações
    let hasError = false;
    if (!name || name.length < 2 || name.length > 50) {
      nameField.classList.add("error");
      hasError = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailField.classList.add("error");
      hasError = true;
    }
    if (!message || message.length < 10 || message.length > 300) {
      messageField.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      formMessage.textContent = "Por favor, preencha os campos corretamente.";
      formMessage.className = "error";
      return;
    }

    // Envio da mensagem
    formMessage.textContent = "Enviando...";
    formMessage.className = "info";

    try {
      await emailjs.send(
        EMAIL_JS_CONFIG.serviceId,
        EMAIL_JS_CONFIG.templateId,
        {
          from_name: name,
          reply_to: email,
          message,
        }
      );
      formMessage.textContent = "Mensagem enviada com sucesso!";
      formMessage.className = "success";
      contactForm.reset();
    } catch (error) {
      console.error(error);
      formMessage.textContent = "Erro ao enviar a mensagem. Tente novamente.";
      formMessage.className = "error";
    }
  });
}

// Função para copiar o e-mail
const copyEmailButton = document.getElementById("copy-email");
const emailText = document.getElementById("user-email");

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(emailText.textContent)
        .then(() => showCopiedPopup("Copiado!"))
        .catch((err) => console.error("Erro ao copiar o e-mail:", err));
    } else {
      alert("Seu navegador não suporta cópia automática.");
    }
  });
}

// Função para exibir o pop-up "Copiado!" como balão sobre o botão
function showCopiedPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = "copied-popup";
  copyEmailButton.style.position = "relative";
  copyEmailButton.appendChild(popup);

  popup.style.bottom = "110%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -10px)";
  popup.style.opacity = "1";

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 300);
  }, POPUP_TIMEOUT);
}
