import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentGridComponent } from './student-grid.component';
import { RouterModule } from '@angular/router';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

const routes = [
  {
      path: '',
      component: StudentGridComponent
  }
];


@NgModule({
  declarations: [StudentGridComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    GridModule,
    ButtonsModule,
    DateInputsModule,
    DropDownsModule,
    PopupModule,
    UploadsModule,
    NotificationModule,
    DialogsModule,

    RouterModule.forChild(routes)
  ]
})
export class StudentGridModule { }
