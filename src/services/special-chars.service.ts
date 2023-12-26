import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialCharsService {
    private readonly baseUrl = 'assets/';

  constructor(private http: HttpClient) { }

  getSpecialChars(): Observable<string[]> {
    return this.http.get(this.baseUrl + 'specialChars.txt', {responseType: 'text'})
    .pipe(map((specialChars) => specialChars.split(/\r?\n/)));
  }
}
