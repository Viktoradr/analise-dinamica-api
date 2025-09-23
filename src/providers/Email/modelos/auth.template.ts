export const AUTH_EMAIL_HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Autenticação</title>  
<style>
@media only screen and (max-width: 620px) {
  table[width="600"] { width: 100% !important; }
  td { padding: 10px !important; }
  span.code { padding: 10px 20px !important; font-size: 28px !important; }
}
</style>
</head><body style="font-family: Arial, sans-serif; background-color:#ffffff; margin:0; padding:0; -webkit-text-fill-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="background-color:#ffffff; margin-top:30px; border-radius:8px; padding:20px;">
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