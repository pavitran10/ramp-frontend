import { async, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { Server } from 'mock-socket';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { Socket } from 'ngx-socket-io';

import { NotificationMessageService } from './notification-message.service';

describe('NotificationService', () => {
  let service: NotificationMessageService;

  const config: SocketIoConfig = { url: window.location.host, options: {} };

    /* setup for mock-socket in order to test socket.io */
    const SERVER_URL = window.location.host;
    const mockServer = new Server(SERVER_URL);

    // setting up server mock
    mockServer.on('connection', socket => {
      setTimeout(() => {
        console.log('sending')
        mockServer.emit('server-message', { message:'test message 1'});

      }, 500);
    });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(config)],
      providers: [ NotificationMessageService ]
    });
    service = TestBed.inject(NotificationMessageService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('tests simple connection and messaging with mock-socket setup', async(done: DoneFn) => {


  //   service._socket.on('server-message', (message: any) => {
  //     console.log(message)
  //     expect(message.message).toEqual('test message 1');
  //     mockServer.stop();
  //     done();
  //   });

  //   });
});
