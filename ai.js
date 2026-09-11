const ReintEIA = {

    name: "Reint-EIA",
    version: "1.2.0",

    conversation: [],
    knowledge: [],

    // =========================
    // INICIALIZACIÓN
    // =========================

    init() {
        this.loadMemory();
        this.loadKnowledge();

        console.log("Reint-EIA V1.2.0 iniciado.");
        console.log("Motor Multi-IA preparado.");
    },

    // =========================
    // MOTOR PRINCIPAL
    // =========================

    async ask(message) {

        if (!message || !message.trim()) {
            return "Decime algo y te responderé. 👋";
        }

        const userMessage = message.trim();

        // Guardar mensaje
        this.conversation.push({
            role: "user",
            content: userMessage,
            date: new Date().toISOString()
        });

        // Buscar conocimiento aprendido
        const learned = this.searchKnowledge(userMessage);

        let response;

        if (learned) {

            response =
                `Según lo que aprendí anteriormente:\n\n${learned}`;

        } else {

            // En V1.2 todavía usamos el sistema local.
            // Después conectaremos las APIs reales.

            response = await this.multiAI(userMessage);
        }

        // Guardar respuesta
        this.conversation.push({
            role: "assistant",
            content: response,
            date: new Date().toISOString()
        });

        this.saveMemory();

        return response;
    },

    // =========================
    // MULTI-IA
    // =========================

    async multiAI(question) {

        console.log("Reint-EIA: iniciando análisis Multi-IA...");

        // IA 1 — Razonamiento
        const reasoningAI = this.reasoningAI(question);

        // IA 2 — Conocimiento
        const knowledgeAI = this.knowledgeAI(question);

        // IA 3 — Creatividad
        const creativeAI = this.creativeAI(question);

        // IA 4 — Programación
        const codingAI = this.codingAI(question);

        // Recopilar respuestas
        const responses = [
            {
                type: "razonamiento",
                response: reasoningAI
            },
            {
                type: "conocimiento",
                response: knowledgeAI
            },
            {
                type: "creatividad",
                response: creativeAI
            },
            {
                type: "programación",
                response: codingAI
            }
        ];

        console.log("Respuestas recibidas:", responses);

        // Sintetizar
        return this.synthesize(question, responses);
    },

    // =========================
    // IA DE RAZONAMIENTO
    // =========================

    reasoningAI(question) {

        return `Analizando la pregunta desde el punto de vista del razonamiento:

"${question}"

La respuesta debería considerar el contexto, los datos disponibles y evitar conclusiones sin suficiente información.`;
    },

    // =========================
    // IA DE CONOCIMIENTO
    // =========================

    knowledgeAI(question) {

        return `Analizando la pregunta desde el punto de vista del conocimiento:

"${question}"

Se deben identificar los conceptos principales y relacionarlos con información relevante.`;
    },

    // =========================
    // IA CREATIVA
    // =========================

    creativeAI(question) {

        return `Analizando la pregunta desde un punto de vista creativo:

"${question}"

Pueden existir diferentes formas de abordar esta situación y generar una solución original.`;
    },

    // =========================
    // IA DE PROGRAMACIÓN
    // =========================

    codingAI(question) {

        return `Analizando la pregunta desde el punto de vista técnico:

"${question}"

Si el problema requiere programación, se puede dividir en componentes pequeños y comprobar cada parte antes de integrarla.`;
    },

    // =========================
    // SINTETIZADOR
    // =========================

    synthesize(question, responses) {

        console.log("Reint-EIA: sintetizando respuestas...");

        let finalResponse =
            "🧠 **Análisis de Reint-EIA**\n\n";

        finalResponse +=
            "Analicé tu pregunta desde diferentes perspectivas.\n\n";

        finalResponse +=
            "🔎 **Razonamiento:**\n" +
            responses[0].response +
            "\n\n";

        finalResponse +=
            "📚 **Conocimiento:**\n" +
            responses[1].response +
            "\n\n";

        finalResponse +=
            "🎨 **Creatividad:**\n" +
            responses[2].response +
            "\n\n";

        finalResponse +=
            "💻 **Área técnica:**\n" +
            responses[3].response;

        return finalResponse;
    },

    // =========================
    // APRENDIZAJE
    // =========================

    learn(question, answer) {

        if (!question || !answer) return;

        this.knowledge.push({
            question: question.toLowerCase(),
            answer: answer,
            date: new Date().toISOString()
        });

        this.saveKnowledge();

        console.log("Reint-EIA aprendió:", question);
    },

    searchKnowledge(question) {

        const text = question.toLowerCase();

        const result = this.knowledge.find(item =>
            text.includes(item.question) ||
            item.question.includes(text)
        );

        return result ? result.answer : null;
    },

    // =========================
    // MEMORIA
    // =========================

    saveMemory() {

        localStorage.setItem(
            "reint_eia_memory",
            JSON.stringify(this.conversation)
        );
    },

    loadMemory() {

        const saved =
            localStorage.getItem("reint_eia_memory");

        if (saved) {

            try {
                this.conversation = JSON.parse(saved);
            } catch {
                this.conversation = [];
            }

        }
    },

    clearMemory() {

        this.conversation = [];

        localStorage.removeItem(
            "reint_eia_memory"
        );
    },

    // =========================
    // CONOCIMIENTO
    // =========================

    saveKnowledge() {

        localStorage.setItem(
            "reint_eia_knowledge",
            JSON.stringify(this.knowledge)
        );
    },

    loadKnowledge() {

        const saved =
            localStorage.getItem("reint_eia_knowledge");

        if (saved) {

            try {
                this.knowledge = JSON.parse(saved);
            } catch {
                this.knowledge = [];
            }

        }
    },

    clearKnowledge() {

        this.knowledge = [];

        localStorage.removeItem(
            "reint_eia_knowledge"
        );
    }
};


// =========================
// HACERLO GLOBAL
// =========================

window.ReintEIA = ReintEIA;


// =========================
// INICIAR
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ReintEIA.init();

    }
);