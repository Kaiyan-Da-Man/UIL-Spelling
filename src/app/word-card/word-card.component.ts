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
    word: string = 'Press New Word';
    spellingVariations: string[] = [];
    needDefinition: boolean = false;
    definition: string = '';
    sound: string = '';
    isRevealed: boolean = true;
    specialChars: string[] = [];
    hasMultipleSpellings: boolean = false;

    userAttempt: string = '';

    constructor(
        private randomWordService: RandomWordService,
        private wordDictionaryService: WordDictionaryService,
        private specialCharsService: SpecialCharsService,
    ) { }

    ngOnInit(): void {
        // TEST: testing for specific words
        // this.getWordDictionary(this.word)
        // this.getNewWord(this.word)
        this.specialCharsService.getSpecialChars().subscribe((specialChars) => {
            this.specialChars = specialChars;
        });
    }

    sayWord(url?: string) {
        if (url) {
            const audio = new Audio(url);
            audio.play();
        } else {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(this.spellingVariations[0]);
            speechSynthesis.speak(utterance);
        }
    }

    // Entry point
    getNewWord(testWord?: string) {
        this.definition = '';
        this.sound = '';
        this.needDefinition = false;
        this.isRevealed = false;
        let randomWord: string = '';
        let processedWord: string = '';

        if (testWord) {
            processedWord = this.processWord(testWord);
        } else {
            this.randomWordService.getRandomWord().subscribe((randomWord) => {
                processedWord = this.processWord(randomWord);
                this.getWordDictionary(processedWord);
            });
        }
    }

    processWord(word: string): string {
        let processedWord = word;

        // remove extra info 'fabliau (singular)'
        if (processedWord.includes('(')) {
            processedWord = processedWord.split('(')[0];
        }

        // remove need definition marker
        if (processedWord.includes(' •')) {
            processedWord = processedWord.slice(0, -2);
            this.needDefinition = true;
        }

        // set word to show on card
        this.word = processedWord;

        // store spelling variations
        this.spellingVariations = processedWord.split(', ');

        // gets the word to look up in api
        if (processedWord.includes(',')) {
            processedWord = processedWord.split(',')[0];
        }
        if (processedWord.includes(' ')) {
            processedWord = processedWord.replace(' ', '%20');
        }

        // TEST:
        console.log(this.word, '|', processedWord);
        // console.log(this.needDefinition);

        return processedWord;
    }

    getWordDictionary(word: string) {
        this.wordDictionaryService.getWordDictionary(word).subscribe((res) => {
            // checks if there is a result
            if (res && res.length > 0) {
                let wordDictionary = res[0]; // use first dictionary information

                // checks if wordDictionary is an object, if it was a string, api does not have word
                if (wordDictionary && typeof wordDictionary === 'object') {
                    if (word !== wordDictionary.hwi.hw.replaceAll('*', '')) {
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
                        this.sayWord();
                        console.warn(
                            'Invalid or incomplete hwi structure:',
                            hwi,
                        );
                    }
                } else {
                    // if it provided alt words
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

        // checks if user attempt is correct
        for (let i = 0; i < this.spellingVariations.length; i++) {
            if (this.userAttempt === this.spellingVariations[i]) {
                this.getNewWord();
                this.userAttempt = '';
                this.isRevealed = false;
                return;
            }
        }

        // attempt is incorrect
        this.userAttempt = '';
        this.isRevealed = true;
    }

}
