import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { onError } from 'apollo-link-error';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { NotificationMessageService } from './services/notification-message.service';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.notification_service_url, options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SocketIoModule.forRoot(config),

    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    DateInputsModule,
    DropDownsModule,
    PopupModule,
    UploadsModule,
    NotificationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink, private notificationMessageService: NotificationMessageService) {
    const errorLink : any = onError(({ networkError }) => {
      const err = networkError as any;
        if(err.statusText == 'Bad Request'){
          let errors = err.error.errors;
          errors.forEach((e : any) => {
            this.notificationMessageService.sendWarningNotification(e.message);
          });
        } else {
          const message = 'Network Not Responding';
          this.notificationMessageService.sendWarningNotification(message);
        }
      });

    const link = httpLink.create({
      uri: environment.student_graph_service_url,
    });

    const httpLinkWithErrorHandling = ApolloLink.from([
      errorLink,
      link,
   ]);

    apollo.create({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache()
    }, 'studentService');
  }
}
