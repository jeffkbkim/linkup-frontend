import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  public socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(this.url);
  }
}
