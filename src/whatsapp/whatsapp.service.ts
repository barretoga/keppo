import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Boom } from '@hapi/boom';
import * as path from 'path';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private socket: any;
  private readonly logger = new Logger(WhatsappService.name);

  async onModuleInit() {
    await this.connectToWhatsApp();
  }

  private async connectToWhatsApp() {
    const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = await import('@whiskeysockets/baileys');
    const qrcodeModule = await import('qrcode-terminal');
    const qrcode = qrcodeModule.default || qrcodeModule;

    const { state, saveCreds } = await useMultiFileAuthState(
      path.resolve('whatsapp_auth_info'),
    );

    this.socket = makeWASocket({
      auth: state,
      // printQRInTerminal: true, // Deprecated
    });

    this.socket.ev.on('creds.update', saveCreds);

    this.socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        this.logger.log('QR Code received. Scan it to login.');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        
        this.logger.warn(
          `Connection closed due to ${lastDisconnect?.error}, reconnecting: ${shouldReconnect}`,
        );

        if (shouldReconnect) {
          this.connectToWhatsApp();
        }
      } else if (connection === 'open') {
        this.logger.log('Opened connection to WhatsApp');
      }
    });
  }

  async sendText(phoneNumber: string, text: string) {
    if (!this.socket) {
        this.logger.error('Socket not initialized');
        return;
    }
    
    // Simple formatting: remove non-digits. 
    // Ideally user provides full number with country code.
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const jid = `${cleanNumber}@s.whatsapp.net`;

    try {
        await this.socket.sendMessage(jid, { text });
        this.logger.log(`Message sent to ${phoneNumber}`);
    } catch (error) {
        this.logger.error(`Failed to send message to ${phoneNumber}:`, error);
    }
  }
}
