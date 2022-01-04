import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationMessageService {

  constructor(private socket: Socket) { }

  get _socket(): any {
    return this.socket;
  }

  set _socket(set:any) {
    this.socket = set;
  }

  sendNotification(message : string){
    this.socket.emit('send-notification', message);
  }

  receiveNotification(){
    return this.socket.fromEvent('receive-notification');
  }

  sendWarningNotification(message : string){
    this.socket.emit('send-warning-notification', message);
  }

  receiveWarningNotification(){
    return this.socket.fromEvent('receive-warning-notification');
  }
}
