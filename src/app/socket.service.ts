import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'localhost:3000';
  public socket: SocketIOClient.Socket;
  public userIdSubject = new BehaviorSubject<number>(null);
  constructor() {
    this.socket = io.connect(this.url);
    this.socket.on('userId', (userId: number) => {
      this.userIdSubject.next(userId);
    });
  }
}
