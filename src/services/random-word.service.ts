import { Injectable } from '@angular/core';
import { SpellingWordsService } from './spelling-words.service';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RandomWordService {
	constructor(private spellingWordsService: SpellingWordsService) {}

	getRandomWord(): Observable<string> {
		return this.spellingWordsService.getSpellingWords().pipe(
			map((wordList) => {
				return wordList[Math.floor(Math.random() * wordList.length)];
			}),
		);
	}
}
