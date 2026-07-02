interface TemplateProps {
  nome: string;
  subtituloHeader: string;
  conteudoHtml: string;
  isErro?: boolean;
}

export function templateBaseSistemaCresce(props: TemplateProps) {
  const gradientHeader = 'linear-gradient(135deg,#4f46e5,#0ea5e9)';

  return `
  <div style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">

    <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 12px 28px rgba(0,0,0,0.12);">

      <div style="background:${gradientHeader}; padding:30px; text-align:center; color:white;">

        <h1 style="margin:0; font-size:22px; letter-spacing:1px;">
          Sistema CRESCE
        </h1>

        <p style="margin:6px 0 0; font-size:13px; opacity:0.9;">
          ${props.subtituloHeader}
        </p>

      </div>

      <div style="padding:28px; color:#111827;">

        <p style="font-size:16px; margin-bottom:4px;">
          Olá, <strong>${props.nome}</strong> 👋
        </p>

        ${props.conteudoHtml}

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

      <div style="padding:14px; text-align:center; font-size:11px; color:#9ca3af; background:#f9fafb;">
        © ${new Date().getFullYear()} Sistema CRESCE • Gestão Escolar
      </div>

    </div>
  </div>
  `;
}