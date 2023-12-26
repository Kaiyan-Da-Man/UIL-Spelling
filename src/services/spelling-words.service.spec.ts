import { TestBed } from '@angular/core/testing';

import { SpellingWordsService } from './spelling-words.service';

describe('SpellingWordsService', () => {
	let service: SpellingWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SpellingWordsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
