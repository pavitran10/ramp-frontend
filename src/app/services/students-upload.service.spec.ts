import { StudentService } from './student.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StudentsUploadService } from './students-upload.service';

describe('StudentsUploadService', () => {
  let service: StudentsUploadService;
  let httpMock: HttpTestingController;

  const file = new File(['sample'], 'sample.csv', { type: 'application/vnd.ms-excel' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentsUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('upload() should POST and return data', () => {
  //   service.upload(file).subscribe((res: any) => {
  //     expect(res).toEqual({ status: true });
  //   });

  //   const req = httpMock.expectOne('http://localhost:3001/api/students/upload');
  //   expect(req.request.method).toBe('POST');
  //   req.flush({ status: true });
  // });
});
