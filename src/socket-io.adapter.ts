import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { Server, ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from './chat/types';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    const clientPort = this.configService.get<number>('SOCKETIO_SERVER_PORT');

    const cors = {
      origin: '*',
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('chat').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
    (socket: SocketWithAuth, next: Function) => {
      // for Postman testing support, fallback to token header
      const token = socket.handshake.auth.token || socket.handshake.headers['token'];
      socket.handshake.headers.authorization

      logger.debug(`Validating auth token before connection: ${token}`);
      
      try {
        const payload = jwtService.verify(token);
        console.log(payload);
        socket.userID = payload.sub;
        next();
      } catch {
        next(new Error('FORBIDDEN'));
      }
    };