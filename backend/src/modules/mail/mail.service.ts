import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendPasswordReset(to: string, token: string) {
    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM', 'noreply@gestao-casal.com'),
      to,
      subject: 'Recuperação de Senha',
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo:</p>
        <p><a href="${resetUrl}">Redefinir minha senha</a></p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    });
  }
}
