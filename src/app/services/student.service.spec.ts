import { Gender, Student } from './../models/student';
import { TestBed } from '@angular/core/testing';

import { createStudent, updateStudent, StudentService, removeStudent, queryStudents } from './student.service';

import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

fdescribe('StudentService', () => {
  let service: StudentService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule.withClients(['studentService'])],
    });
    service = TestBed.inject(StudentService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expect to create a student', () => {
    const mockCreateStudentData = {
      name : "Gayan",
      gender: "Male",
      address: "Colombo",
      mobile_no: "0123456789",
      dob: new Date('1988-12-03'),
    }

    service.createStudent(mockCreateStudentData).subscribe((student) => {
    })

    const op = controller.expectOne((operation) => {
      expect(operation.clientName).toEqual('studentService');
      expect(operation.query.definitions).toEqual(createStudent.definitions);
      return true;
    });

    controller.verify();
  })

  it('expect to update a student', () => {
    const mockUpdateStudentData = {
      name : "John",
      gender: "Male",
      address: "Colombo",
      mobile_no: "0123456789",
      dob: new Date('1988-12-03'),
      id: 5
    }

    service.updateStudent(mockUpdateStudentData.id, mockUpdateStudentData).subscribe((student) => {
    })

    const op = controller.expectOne((operation) => {
      expect(operation.clientName).toEqual('studentService');
      expect(operation.query.definitions).toEqual(updateStudent.definitions);
      return true;
    });

    controller.verify();
  })

  it('expect to remove a student', () => {
    const mockRemoveStudentData = {
      name : "Kumar",
      gender: "Male",
      address: "Colombo",
      mobile_no: "0123456789",
      dob: new Date('1988-12-03'),
      id: 5
    }

    service.removeStudent(mockRemoveStudentData.id).subscribe((student) => {
    })

    const op = controller.expectOne((operation) => {
      expect(operation.clientName).toEqual('studentService');
      expect(operation.query.definitions).toEqual(removeStudent.definitions);
      return true;
    });

    controller.verify();
  })

  it('expect to get all students', () => {
    const student = {
      id: 128,
      name: "John",
      gender: Gender.Male,
      address: "Kandy",
      mobile_no: "0123456789",
      dob: new Date("1993-04-08T18:30:00.000Z"),
      age: 28
    };

    const studentsArray = [student]

    //Call the relevant method
    service.findAll().subscribe((students) => {
      expect(students).toEqual(studentsArray)
      expect(students[0].id).toEqual(128);
      expect(students[0].name).toEqual("John");
    });

    // The following `expectOne()` will match the operation's document.
    // If no requests or multiple requests matched that document
    // `expectOne()` would throw.
    const op = controller.expectOne(queryStudents);


    expect(op.operation.query.definitions).toEqual(queryStudents.definitions);

    // Respond with mock data, causing Observable to resolve.
    op.flush({
      data: {
        students: [
          {
            id: 128,
            name: "John",
            gender: Gender.Male,
            address: "Kandy",
            mobile_no: "0123456789",
            dob: new Date("1993-04-08T18:30:00.000Z"),
            age: 28
          },
        ]
      },
    });

    // Finally, assert that there are no outstanding operations.
    controller.verify();

  })

  afterEach(() => {
    controller.verify();
  });

});
