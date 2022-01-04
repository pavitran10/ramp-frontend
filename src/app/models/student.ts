export interface Student {
  id?: number;
  name: string;
  gender: Gender;
  address: string;
  mobile_no: string;
  dob: Date;
  age?: number;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}
