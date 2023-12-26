import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WordDictionary } from '../model/wordDictionary';
// import { withFetch } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class WordDictionaryService {
	constructor(private http: HttpClient) {}

	getWordDictionary(word: string): Observable<WordDictionary[]> {
		return this.http.get<WordDictionary[]>(
			`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=a20edc4b-1173-42ab-8965-54db3f7000da`,
		);
	}
}
