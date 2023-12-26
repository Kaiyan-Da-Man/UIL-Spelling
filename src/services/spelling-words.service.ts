import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SpellingWordsService {
	private readonly baseUrl = 'assets/';

	constructor(private http: HttpClient) {}

	getSpellingWords(): Observable<string[]> {
		// assuming each item ends with newline
		return this.http
			.get(this.baseUrl + 'spellingWords.txt', { responseType: 'text' })
			.pipe(map((words) => words.split(/\r?\n/)));
	}
}
