const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Permitir solicitudes desde nuestra página
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Responder a OPTIONS
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Ruta principal
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
            ok: true,
            proyecto: "Reint-EIA",
            version: "1.2.1",
            mensaje: "Backend de Reint-EIA funcionando 🚀"
        }));

        return;
    }

    // Ruta de prueba de IA
    if (req.method === "POST" && req.url === "/api/chat") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                const mensaje = data.message || "";

                res.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    ok: true,
                    respuesta:
                        `Reint-EIA recibió tu mensaje: "${mensaje}" 🧠`
                }));

            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    ok: false,
                    error: "El mensaje no tiene un formato válido."
                }));
            }
        });

        return;
    }

    // Ruta inexistente
    res.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
        ok: false,
        error: "Ruta no encontrada."
    }));
});

server.listen(PORT, () => {
    console.log(
        `Reint-EIA backend iniciado en http://localhost:${PORT}`
    );
});