import { Student } from './../models/student';
import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql, Query } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface QueryStudents {
  students: Student[]
}

export const queryStudents = gql`
  query students {
    students {
      id
      name
      gender
      address
      mobile_no
      dob
      age
    }
  }
`;

export const createStudent = gql`
  mutation createStudent(
    $name: String!
    $gender: String!
    $address: String!
    $mobile_no: String!
    $dob: DateTime!
  ) {
    createStudent(
      createStudentInput: {
        name: $name
        gender: $gender
        address: $address
        mobile_no: $mobile_no
        dob: $dob
      }
    ) {
      id
      name
      gender
      address
      dob
      age
    }
  }
`;

export const updateStudent = gql`
  mutation updateStudent(
    $id: Int!
    $name: String!
    $gender: String!
    $address: String!
    $mobile_no: String!
    $dob: DateTime!
  ) {
    updateStudent(
      updateStudentInput: {
        id: $id
        name: $name
        gender: $gender
        address: $address
        mobile_no: $mobile_no
        dob: $dob
      }
    ) {
      id
      name
      gender
      address
      dob
      age
    }
  }
`;

export const removeStudent = gql`
  mutation removeStudent($id: Int!) {
    removeStudent(id: $id) {
      name
      gender
      address
      dob
      age
    }
  }
`;

export interface ICreateUserContext {
  name: string;
  gender: string;
  address: string;
  mobile_no: string;
  dob: Date;
}

export interface IUpdateUserContext {
  id: number;
  name: string;
  gender: string;
  address: string;
  mobile_no: string;
  dob: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apollo: ApolloBase;
  prototype: any;

  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('studentService');
  }

  findAll(): Observable<Student[]> {
    return this.apollo
      .watchQuery<QueryStudents>({
        query: queryStudents
      })
      .valueChanges.pipe(map(res => res.data.students));
  }

  createStudent(student: ICreateUserContext) {
    return this.apollo
      .mutate({
        mutation: createStudent,
        variables: {
          ...student
        },
        // refetchQueries: Updates the cache in order to refetch parts of the store
        // that may have been affected by the mutation
        refetchQueries: [
          {
            query: queryStudents
          }
        ]
      });
  }

  updateStudent(id: number, student: IUpdateUserContext) {
    return this.apollo
      .mutate({
        mutation: updateStudent,
        variables: {
          ...student,
          id: id
        },
        // refetchQueries: Updates the cache in order to refetch parts of the store
        // that may have been affected by the mutation
        refetchQueries: [
          {
            query: queryStudents
          }
        ]
      });
  }

  removeStudent(id: number) {
    console.log(id)
    return this.apollo
      .mutate({
        mutation: removeStudent,
        variables: {
          id
        },
        refetchQueries: [
          {
            query: queryStudents
          }
        ]
      });
  }

  refetchData() {
    this.apollo.client.refetchQueries({
      include: [queryStudents],
    });
  }
}
