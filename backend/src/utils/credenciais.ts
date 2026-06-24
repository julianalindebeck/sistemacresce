export function templateEmailCredenciais(
  nome: string,
  email: string,
  senha: string,
  contextoAcesso: string
) {
  return `
  <div style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">

    <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 12px 28px rgba(0,0,0,0.12);">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#4f46e5,#0ea5e9); padding:30px; text-align:center; color:white;">

        <h1 style="margin:0; font-size:22px; letter-spacing:1px;">
          Sistema CRESCE
        </h1>

        <p style="margin:6px 0 0; font-size:13px; opacity:0.9;">
          Controle e Registro Escolar de Suporte ao Comportamento e Evolução
        </p>

      </div>

      <!-- BODY -->
      <div style="padding:28px; color:#111827;">

        <p style="font-size:16px; margin-bottom:4px;">
          Olá, <strong>${nome}</strong> 👋
        </p>

        <!-- CONTEXTO mais próximo do nome -->
        <p style="font-size:14px; color:#4b5563; line-height:1.6; margin-top:0;">
          ${contextoAcesso}
        </p>

        <!-- CREDENCIAIS -->
        <div style="margin:22px 0; padding:18px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">

          <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">
            Seus dados de acesso:
          </p>

          <p style="margin:6px 0; font-size:14px;">
            <strong>E-mail:</strong> ${email}
          </p>

          <p style="margin:6px 0; font-size:14px;">
            <strong>Senha:</strong>
            <span style="color:#111827; font-family:monospace; font-size:14px;">
              ${senha}
            </span>
          </p>

        </div>

        <!-- ASSINATURA -->
        <div style="margin-top:30px; font-size:13px; color:#6b7280; line-height:1.6; border-top:1px solid #e5e7eb; padding-top:16px;">

          <p style="margin:0;">
            Atenciosamente,<br>
            <strong>Equipe CRESCE</strong>
          </p>

          <p style="margin:6px 0 0;">
            Este é um e-mail automático do sistema. Não é necessário responder.
          </p>

        </div>

      </div>

      <!-- FOOTER -->
      <div style="padding:14px; text-align:center; font-size:11px; color:#9ca3af; background:#f9fafb;">
        © ${new Date().getFullYear()} Sistema CRESCE • Gestão Escolar
      </div>

    </div>
  </div>
  `;
}