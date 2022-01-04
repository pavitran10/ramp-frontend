import { NotificationMessageService } from '../services/notification-message.service';
import { StudentsUploadService } from './../services/students-upload.service';
import { Gender } from './../models/student';
import { StudentService } from './../services/student.service';
import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { NotificationService } from "@progress/kendo-angular-notification";
import { ActionsLayout } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-student-grid',
  templateUrl: './student-grid.component.html',
  styleUrls: ['./student-grid.component.scss']
})
export class StudentGridComponent implements OnInit {

  students : Student[] = [];
  genderList = Object.values(Gender);
  gender = Gender;
  showAddView = false;
  today = new Date();
  view!: GridDataResult;

  private editedRowIndex: any;
  public formGroup: FormGroup = new FormGroup({});

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public myRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx"],
  };

  uploadFile: any;

  public myForm: FormGroup;
  public submitted = false;

  public disabledDates = (date: Date): boolean => {
    return date >= new Date();
  };

  public openedRemoveDialog = false;
  public actionsLayout: ActionsLayout = "normal";

  public removeEvent!: { sender: any; dataItem: any; };

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private studentsUploadService: StudentsUploadService,
    private notificationMessageService: NotificationMessageService,
    private notificationService: NotificationService
  ) {
    this.myForm = this.fb.group({
      files: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.notificationMessageService.receiveNotification().subscribe((message : any) => {
      //this.messages.push(message);
      console.log(message);
      this.show(message);
    });

    this.notificationMessageService.receiveWarningNotification().subscribe((message : any) => {
      //this.messages.push(message);
      console.log(message);
      this.warn(message);
    });


    this.resetData();
  }

  public resetData() {
    this.studentService.findAll().subscribe(students => {
      this.students = students;
      const modifiedStudents = students.map(stu => {
        const obj = Object.assign({}, stu);
        obj.dob = new Date(obj.dob);
        return obj;
      })
      this.view = process(modifiedStudents, this.gridState)
    })
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.resetData();
  }

  public addHandler(event : any) {
    const { sender } = event;
    this.closeEditor(sender);
    sender.addRow(this.createFormGroup());
  }

  public editHandler(event : any) {
    const { sender, rowIndex, dataItem } = event;
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.updateFormGroup(dataItem));
  }

  public cancelHandler(event : any) {
    const { sender, rowIndex } = event;
    this.closeEditor(sender, rowIndex);
    //sender.closeRow(rowIndex);
  }

  public saveHandler(event : any) {
    const { sender, formGroup, rowIndex, isNew, dataItem } = event;
    if (formGroup.valid) {
      if(isNew){
        this.studentService.createStudent(formGroup.value).subscribe(() => {
          this.resetData();
          sender.closeRow(rowIndex);
          this.notificationMessageService.sendNotification('New Student Created');
        });
      } else {
        const studentId = dataItem.id;
        this.studentService.updateStudent(studentId, formGroup.value).subscribe(() => {
          this.resetData();
          sender.closeRow(rowIndex);
          this.notificationMessageService.sendNotification('Student Details Updated');
        });
      }
    }
  }

  public removeHandler(event : any) {
    const { sender, dataItem } = event;
    this.removeEvent = { sender, dataItem };
    this.openedRemoveDialog = true;
}

  public createFormGroup(): FormGroup {
    return this.formGroup = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      name: new FormControl('', Validators.required),
      gender: new FormControl(Gender.Male, Validators.required),
      address: new FormControl('', Validators.required),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern(new RegExp(/^0\d{9}$/))]),
      dob: new FormControl('', Validators.required),
      age: new FormControl({value: '', disabled: true})
    });
  }

  public updateFormGroup(dataItem : Student): FormGroup {
    return this.formGroup = new FormGroup({
      id: new FormControl({value: dataItem.id, disabled: true}),
      name: new FormControl(dataItem.name, Validators.required),
      gender: new FormControl(dataItem.gender, Validators.required),
      address: new FormControl(dataItem.address, Validators.required),
      mobile_no: new FormControl(dataItem.mobile_no, [Validators.required, Validators.pattern(new RegExp(/^0\d{9}$/))]),
      dob: new FormControl(dataItem.dob, Validators.required),
      age: new FormControl({value: dataItem.age, disabled: true})
    });
  }

  private closeEditor(grid : any, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = new FormGroup({});
  }

  public valueChange(event: any){
    if(this.myForm.valid){
      console.log(event[0])
      this.uploadFile = event[0];
    }
  }

  public remove() {
    this.submitted = false;
    this.myForm = this.fb.group({
      files: ['', [Validators.required]],
    });
  }

  public save() {
    if(this.myForm.valid){
      this.submitted = true;
      this.studentsUploadService.upload(this.uploadFile).subscribe((res) => {
        console.log(res)
        if(res.status){
          this.studentService.refetchData();
          this.notificationMessageService.sendNotification('New Students Details Uploaded');
        } else {
          this.notificationMessageService.sendWarningNotification('Unable To Uploads Student Details. Please check Excel file data');
        }
      })
    }
  }

  public show(content : string): void {
    this.notificationService.show({
      content: content,
      animation: { type: "slide", duration: 400 },
      position: { horizontal: "right", vertical: "bottom" },
      type: { style: "success", icon: true },
    });
  }

  public warn(content : string): void {
    this.notificationService.show({
      content: content,
      animation: { type: "slide", duration: 400 },
      position: { horizontal: "right", vertical: "bottom" },
      type: { style: "error", icon: true },
    });
  }

  public onDialogClose() {
    this.openedRemoveDialog = false;
  }

  public onDeleteData() {
    const { sender, dataItem } = this.removeEvent;
    const studentId = dataItem.id;
    this.studentService.removeStudent(studentId).subscribe(() => {
      sender.cancelCell();
      this.notificationMessageService.sendNotification('Student Deleted');
    })
    this.openedRemoveDialog = false;
  }

  public open() {
    this.openedRemoveDialog = true;
  }
}
