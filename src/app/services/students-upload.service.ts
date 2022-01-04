import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { NotificationMessageService } from './notification-message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsUploadService {

  constructor(private httpClient: HttpClient, private notificationMessageService: NotificationMessageService) { }

  upload(file: File) {
    const formData = new FormData();
    formData.append('xlsx', file);

    const url = environment.student_upload_service_url;

    return this.httpClient.post<any>(url, formData).pipe(map(res => res), catchError(async (err) => this.notificationMessageService.sendWarningNotification(err.message)));
  }
}
