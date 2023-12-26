import { Component, OnInit } from '@angular/core';
import { RandomWordService } from '../../services/random-word.service';
import { WordDictionaryService } from '../../services/word-dictionary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialCharsService } from '../../services/special-chars.service';
import { ButtonComponent } from '../button/button.component';

@Component({
	selector: 'word-card',
	standalone: true,
	imports: [CommonModule, FormsModule, ButtonComponent],
	templateUrl: './word-card.component.html',
	styleUrl: './word-card.component.scss',
})
export class WordCardComponent implements OnInit {
	word: string = '';
	needDefinition: boolean = false; // TODO: change back to false
	definition: string = '';
	sound: string = '';
	// soundURL: string = '';
	isRevealed: boolean = false;
	specialChars: string[] = [];

	userAttempt: string = '';

	constructor(
		private randomWordService: RandomWordService,
		private wordDictionaryService: WordDictionaryService,
		private specialCharsService: SpecialCharsService,
	) {}

	ngOnInit(): void {
		this.getNewWord();
		// TEST: testing for specific words
		// this.getWordDictionary(this.word)
		this.specialCharsService.getSpecialChars().subscribe((specialChars) => {
			this.specialChars = specialChars;
		});
	}

	sayWord(url?: string) {
		if (url) {
			const audio = new Audio(url);
			audio.play();
		} else {
			const utterance = new SpeechSynthesisUtterance(this.word);
			speechSynthesis.speak(utterance);
		}
	}

	getNewWord() {
		this.definition = '';
		this.sound = '';
		// this.soundURL = '';
		this.needDefinition = false;
		this.isRevealed = false;

		this.randomWordService.getRandomWord().subscribe((randomWord) => {
			let modifiedWord = this.modifyWord(randomWord);

			this.getWordDictionary(modifiedWord);
		});
	}

	modifyWord(word: string): string {
		let modifiedWord = word;

		if (modifiedWord.includes('(')) {
			modifiedWord = modifiedWord.split('(')[0];
		}
		if (modifiedWord.includes(' •')) {
			modifiedWord = modifiedWord.slice(0, -2);
			this.needDefinition = true;
		}

		this.word = modifiedWord;

		if (modifiedWord.includes(',')) {
			modifiedWord = modifiedWord.split(',')[0];
		}
		if (modifiedWord.includes(' ')) {
			modifiedWord = modifiedWord.replace(' ', '%20');
		}

		// TEST:
		console.log(this.word, '|', modifiedWord);
		// console.log(this.needDefinition);

		return modifiedWord;
	}

	getWordDictionary(word: string) {
		this.wordDictionaryService.getWordDictionary(word).subscribe((res) => {
			// checks if there is a result
			if (res && res.length > 0) {
				console.log(res);

				let wordDictionary = res[0]; // use first dictionary information

				// checks if wordDictionary is an object, if it was a string, api does not have word
				if (wordDictionary && typeof wordDictionary === 'object') {
					if (word !== wordDictionary.hwi.hw.replaceAll('*', '')) {
						// this.soundURL = '';
						this.sayWord();
						return;
					}

					// get definition
					this.definition =
						wordDictionary.shortdef &&
						wordDictionary.shortdef.length > 0
							? wordDictionary.shortdef[0]
							: 'No definition available';

					// get sound
					const hwi = wordDictionary.hwi;

					if (
						hwi &&
						typeof hwi === 'object' &&
						'prs' in hwi &&
						hwi.prs !== undefined
					) {
						// TODO: add other pronunciations if there are multiple
						this.sound = hwi.prs[0].sound.audio;
						this.getDictionarySoundURL();
					} else {
						// this.soundURL = '';
						this.sayWord();
						console.warn(
							'Invalid or incomplete hwi structure:',
							hwi,
						);
					}
				} else {
					// if it provided alt words
					// this.soundURL = '';
					this.sayWord();
					console.warn(
						'Invalid or non-object wordDictionary:',
						wordDictionary,
					);
					return;
				}

				// TEST:
				// console.log(this.word, '|', this.definition, '|', this.sound);
			} else {
				console.warn('Empty or unexpected response:', res);
				// this.soundURL = '';
				return;
			}
		});
	}

	getDictionarySoundURL() {
		// TODO: add alternative sounds if prs.length > 1
		let url = 'https://media.merriam-webster.com/audio/prons/en/us/wav/';

		if (this.sound.slice(0, 3) === 'bix') {
			url = url.concat('bix/');
		} else if (this.sound.slice(0, 2) === 'gg') {
			url = url.concat('gg/');
		} else {
			url = url.concat(this.sound.charAt(0) + '/');
		}

		// this.soundURL = url.concat(this.sound + '.wav');
		url = url.concat(this.sound + '.wav');

		this.sayWord(url);
	}

	checkWord() {
		this.userAttempt = this.userAttempt.replace("'", '\u{2019}');

		if (this.userAttempt === this.word) {
			this.getNewWord();
			this.userAttempt = '';
			this.isRevealed = false;
		} else {
			// TODO: have word get revealed and allow user to type again.
			console.log('incorrect');
			this.userAttempt = '';
			this.isRevealed = true;
		}
	}
}
