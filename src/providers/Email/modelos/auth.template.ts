export const AUTH_EMAIL_HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Código de Autenticação</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f4f4f4; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; margin-top:30px; border-radius:8px; padding:20px;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="https://analise-dinamica.vercel.app/images/logo.png" alt="Logo" width="120"/>
            </td>
          </tr>

          <tr>
            <td style="text-align:center; font-size:18px; padding-bottom:20px;">
              <strong>Olá [NOME],</strong><br>
              Use o código abaixo para acessar sua conta:
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px;">
              <span style="font-size:32px; font-family: 'Courier New', monospace; color:#ffffff; background-color:#007bff; padding:15px 30px; border-radius:8px; letter-spacing:4px;">
                [CODIGO]
              </span>
            </td>
          </tr>

          <tr>
            <td style="text-align:center; font-size:14px; color:#555; padding-top:10px; padding-bottom:20px;">
              Este código expira em [TIME] minutos.<br>
              Se você não solicitou este código, ignore este e-mail.
            </td>
          </tr>

          <tr>
            <td style="text-align:center; font-size:12px; color:#999; padding-top:10px; border-top:1px solid #eee;">
              © 2025 Sua Empresa. Todos os direitos reservados.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;