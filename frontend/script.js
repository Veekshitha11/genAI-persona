const API_BASE_URL = "https://genai-persona-khhd.onrender.com/";

const personas = {
  anshuman: {
    label: "Anshuman Singh",
    tagline: "Systems-first founder mindset",
    suggestions: [
      "How should I build an engineering growth system?",
      "I am stuck in DSA despite daily practice. Next step?",
      "How do peer groups increase learning speed?"
    ]
  },
  abhimanyu: {
    label: "Abhimanyu Saxena",
    tagline: "Execution and product-operator thinking",
    suggestions: [
      "How do I convert theory into shipped projects?",
      "What can I deliver in one focused week?",
      "How should I design an output-driven learning plan?"
    ]
  },
  kshitij: {
    label: "Kshitij Mishra",
    tagline: "Mentor-led, fundamentals-first growth",
    suggestions: [
      "How do I rebuild my coding fundamentals calmly?",
      "What routine helps long-term consistency?",
      "How can I stop switching resources too often?"
    ]
  }
};

let activePersona = "anshuman";

const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const typingIndicator = document.getElementById("typingIndicator");
const personaButtons = document.querySelectorAll(".persona-btn");
const activePersonaLabel = document.getElementById("activePersonaLabel");
const activePersonaTagline = document.getElementById("activePersonaTagline");
const suggestionChips = document.getElementById("suggestionChips");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderSuggestions() {
  const personaData = personas[activePersona];
  suggestionChips.innerHTML = "";

  personaData.suggestions.forEach((question) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = question;
    btn.addEventListener("click", () => {
      userInput.value = question;
      userInput.focus();
    });
    suggestionChips.appendChild(btn);
  });
}

function resetConversation() {
  chatBox.innerHTML = "";
  addMessage(`You are now chatting with ${personas[activePersona].label}. Ask your question.`);
}

function setActivePersona(personaKey) {
  activePersona = personaKey;
  activePersonaLabel.textContent = personas[personaKey].label;
  activePersonaTagline.textContent = personas[personaKey].tagline;

  personaButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.persona === personaKey);
  });

  renderSuggestions();
  resetConversation();
}

personaButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActivePersona(btn.dataset.persona);
  });
});

async function sendMessage(message) {
  addMessage(message, "user");
  typingIndicator.classList.remove("hidden");
  sendBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        persona: activePersona
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.reply || "Request failed");
    }

    addMessage(data.reply, "bot");
  } catch (error) {
    addMessage(
      error.message || "Something went wrong. Please check if backend is running.",
      "error"
    );
  } finally {
    typingIndicator.classList.add("hidden");
    sendBtn.disabled = false;
  }
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  userInput.value = "";
  await sendMessage(message);
});

setActivePersona(activePersona);
