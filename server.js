const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "BlackJack AI",
    service: "cTrader OAuth Backend",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.get("/auth/ctrader", (req, res) => {
  const clientId = process.env.CTRADER_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "CTRADER_CLIENT_ID não configurado"
    });
  }

  const redirectUri = process.env.CTRADER_REDIRECT_URI;

  if (!redirectUri) {
    return res.status(500).json({
      error: "CTRADER_REDIRECT_URI não configurado"
    });
  }

  const authUrl =
    "https://id.ctrader.com/my/settings/openapi/grantingaccess" +
    "?client_id=" +
    encodeURIComponent(clientId) +
    "&redirect_uri=" +
    encodeURIComponent(redirectUri) +
    "&scope=trading";

  res.redirect(authUrl);
});

app.get("/auth/ctrader/callback", (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).json({
      error,
      description: error_description || "Autorização recusada"
    });
  }

  if (!code) {
    return res.status(400).json({
      error: "Código OAuth não recebido"
    });
  }

  res.json({
    status: "authorization_code_received",
    message:
      "Código recebido com sucesso. A troca pelo token será feita pelo backend.",
    code_received: true
  });
});

app.listen(PORT, () => {
  console.log(`BlackJack AI backend online na porta ${PORT}`);
});
