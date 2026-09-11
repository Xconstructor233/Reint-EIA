document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // ELEMENTOS DE LA INTERFAZ
    // ================================

    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    const settingsButton = document.getElementById("settingsButton");
    const settingsPanel = document.getElementById("settingsPanel");
    const closeSettings = document.getElementById("closeSettings");


    // ================================
    // COMPROBAR ELEMENTOS
    // ================================

    if (!chatMessages || !messageInput || !sendButton) {
        console.error(
            "Reint-EIA: No se encontraron los elementos principales del chat."
        );
        return;
    }


    // ================================
    // CREAR MENSAJE
    // ================================

    function createMessage(text, sender) {

        const message = document.createElement("div");

        message.classList.add(
            "message",
            sender === "user"
                ? "user-message"
                : "ai-message"
        );

        // ----------------------------
        // MENSAJE DEL USUARIO
        // ----------------------------

        if (sender === "user") {

            message.textContent = text;

        }

        // ----------------------------
        // MENSAJE DE REINT-EIA
        // ----------------------------

        else {

            message.innerHTML = renderMarkdown(text);

        }

        chatMessages.appendChild(message);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        return message;
    }


    // ================================
    // MENSAJE "PENSANDO"
    // ================================

    function createThinkingMessage() {

        return createMessage(
            "Reint-EIA está pensando... 🧠",
            "ai"
        );

    }


    // ================================
    // MARKDOWN
    // ================================

    function escapeHTML(text) {

        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function renderMarkdown(text) {

        if (!text) {
            return "";
        }


        // --------------------------------
        // ESCAPAR HTML
        // --------------------------------

        let safeText = escapeHTML(String(text));


        // --------------------------------
        // GUARDAR BLOQUES DE CÓDIGO
        // --------------------------------

        const codeBlocks = [];

        safeText = safeText.replace(
            /```(?:[a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g,
            (match, code) => {

                const index = codeBlocks.length;

                codeBlocks.push(
                    `<pre class="code-block"><code>${code.trim()}</code></pre>`
                );

                return `CODEBLOCK_${index}`;

            }
        );


        // --------------------------------
        // CÓDIGO EN LÍNEA
        // --------------------------------

        safeText = safeText.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


        // --------------------------------
        // SEPARAR LÍNEAS
        // --------------------------------

        const lines = safeText.split(/\r?\n/);

        let html = "";

        let insideList = false;


        // --------------------------------
        // PROCESAR CADA LÍNEA
        // --------------------------------

        lines.forEach(line => {

            const trimmed = line.trim();


            // ----------------------------
            // LÍNEA VACÍA
            // ----------------------------

            if (trimmed === "") {

                if (insideList) {

                    html += "</ul>";

                    insideList = false;

                }

                html += '<div class="markdown-space"></div>';

                return;

            }


            // ----------------------------
            // BLOQUE DE CÓDIGO
            // ----------------------------

            if (
                /^CODEBLOCK_\d+$/.test(trimmed)
            ) {

                if (insideList) {

                    html += "</ul>";

                    insideList = false;

                }

                const index = Number(
                    trimmed.replace("CODEBLOCK_", "")
                );

                html += codeBlocks[index];

                return;

            }


            // ----------------------------
            // TÍTULO H1
            // ----------------------------

            if (/^# /.test(trimmed)) {

                if (insideList) {

                    html += "</ul>";

                    insideList = false;

                }

                const content =
                    trimmed.replace(/^# /, "");

                html += `<h1>${content}</h1>`;

                return;

            }


            // ----------------------------
            // TÍTULO H2
            // ----------------------------

            if (/^## /.test(trimmed)) {

                if (insideList) {

                    html += "</ul>";

                    insideList = false;

                }

                const content =
                    trimmed.replace(/^## /, "");

                html += `<h2>${content}</h2>`;

                return;

            }


            // ----------------------------
            // TÍTULO H3
            // ----------------------------

            if (/^### /.test(trimmed)) {

                if (insideList) {

                    html += "</ul>";

                    insideList = false;

                }

                const content =
                    trimmed.replace(/^### /, "");

                html += `<h3>${content}</h3>`;

                return;

            }


            // ----------------------------
            // LISTAS
            // ----------------------------

            if (/^[-•] /.test(trimmed)) {

                if (!insideList) {

                    html += "<ul>";

                    insideList = true;

                }

                const content =
                    trimmed.replace(/^[-•] /, "");

                html += `<li>${content}</li>`;

                return;

            }


            // ----------------------------
            // CERRAR LISTA
            // ----------------------------

            if (insideList) {

                html += "</ul>";

                insideList = false;

            }


            // ----------------------------
            // NEGRITA
            // ----------------------------

            let content = trimmed;

            content = content.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            );


            // ----------------------------
            // CURSIVA
            // ----------------------------

            content = content.replace(
                /(?<!\*)\*([^*]+)\*(?!\*)/g,
                "<em>$1</em>"
            );


            // ----------------------------
            // PÁRRAFO
            // ----------------------------

            html += `<p>${content}</p>`;

        });


        // --------------------------------
        // CERRAR LISTA
        // --------------------------------

        if (insideList) {

            html += "</ul>";

        }


        return html;

    }


    // ================================
    // ENVIAR MENSAJE
    // ================================

    async function sendMessage() {

        const message =
            messageInput.value.trim();


        // No enviar vacío

        if (!message) {
            return;
        }


        // ----------------------------
        // MOSTRAR MENSAJE DEL USUARIO
        // ----------------------------

        createMessage(
            message,
            "user"
        );


        // ----------------------------
        // LIMPIAR INPUT
        // ----------------------------

        messageInput.value = "";

        messageInput.style.height = "auto";


        // ----------------------------
        // DESACTIVAR BOTÓN
        // ----------------------------

        sendButton.disabled = true;


        // ----------------------------
        // MENSAJE DE PENSAMIENTO
        // ----------------------------

        const thinking =
            createThinkingMessage();


        try {

            // ------------------------
            // COMPROBAR AI.JS
            // ------------------------

            if (
                typeof window.ReintEIA ===
                "undefined"
            ) {

                throw new Error(
                    "ai.js no está cargado."
                );

            }


            // ------------------------
            // ENVIAR A REINT-EIA
            // ------------------------

            const response =
                await window.ReintEIA.ask(
                    message
                );


            // ------------------------
            // QUITAR "PENSANDO"
            // ------------------------

            thinking.remove();


            // ------------------------
            // MOSTRAR RESPUESTA
            // ------------------------

            createMessage(
                response,
                "ai"
            );

        }

        catch (error) {

            console.error(
                "Error de Reint-EIA:",
                error
            );


            // ------------------------
            // QUITAR "PENSANDO"
            // ------------------------

            thinking.remove();


            // ------------------------
            // MOSTRAR ERROR
            // ------------------------

            createMessage(
                "Ocurrió un error al procesar tu mensaje. Revisá la consola para ver el error.",
                "ai"
            );

        }


        // ----------------------------
        // REACTIVAR BOTÓN
        // ----------------------------

        sendButton.disabled = false;

        messageInput.focus();

    }


    // ================================
    // BOTÓN ENVIAR
    // ================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ================================
    // ENTER PARA ENVIAR
    // ================================

    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ================================
    // TEXTAREA AUTOMÁTICO
    // ================================

    messageInput.addEventListener(
        "input",
        function () {

            this.style.height = "auto";

            this.style.height =
                this.scrollHeight + "px";

        }
    );


    // ================================
    // ABRIR CONFIGURACIÓN
    // ================================

    if (
        settingsButton &&
        settingsPanel
    ) {

        settingsButton.addEventListener(
            "click",
            () => {

                settingsPanel.classList.add(
                    "active"
                );

            }
        );

    }


    // ================================
    // CERRAR CONFIGURACIÓN
    // ================================

    if (
        closeSettings &&
        settingsPanel
    ) {

        closeSettings.addEventListener(
            "click",
            () => {

                settingsPanel.classList.remove(
                    "active"
                );

            }
        );

    }


    // ================================
    // MENSAJE INICIAL
    // ================================

    if (
        chatMessages.children.length === 0
    ) {

        createMessage(
            "¡Hola! 👋 Soy Reint-EIA. ¿En qué puedo ayudarte?",
            "ai"
        );

    }


    // ================================
    // INICIAR
    // ================================

    console.log(
        "Reint-EIA: interfaz iniciada correctamente."
    );

});