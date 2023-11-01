import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jsonpatch from 'fast-json-patch';
import { ConfigService } from '@nestjs/config';
import { OnModuleDestroy } from '@nestjs/common';

@WebSocketGateway(8181, {
  cors: {
    origin: '*'
  }
})
export class DataGateway
  implements OnGatewayInit, OnGatewayConnection, OnModuleDestroy
{
  private interval: NodeJS.Timeout;
  private data: any = {
    text: 'Test text',

    num: 0,
    bool: true,
    array: []
  };

  @WebSocketServer()
  server: Server;

  constructor(private readonly config: ConfigService) {}

  handleConnection(client: Socket) {
    client.emit('data', this.data);
  }
  afterInit() {
    this.interval = setInterval(
      () => {
        const data = {
          ...this.data,

          bool: !!Math.round(Math.random()),
          num: Math.round(Math.random() * 1000),
          array: [...Array(Math.round(Math.random() * 10)).keys()].map(
            (i) => i++
          )
        };

        const patch = jsonpatch.compare(this.data, data);

        this.server.emit('patch', patch);

        jsonpatch.applyPatch(this.data, patch);
      },
      this.config.get('DATA_CHANGE_INTERVAL_MS') ?? 2500
    );
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }
}
