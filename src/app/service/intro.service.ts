import {Injectable} from '@angular/core';
import * as introJs from 'intro.js/intro';

@Injectable({
    providedIn: 'root'
})
export class IntroService {
    static INTRO_VIEWED_KEY = 'intro-viewed';
    static INTRO_VIEWED_VALUE = 'done';
    introJS = introJs();
    constructor() {
    }
    public startIntroJS(checkViewed: boolean) {
        if (checkViewed === true && localStorage.getItem(IntroService.INTRO_VIEWED_KEY) === IntroService.INTRO_VIEWED_VALUE) {
            return;
        }
        this.introJS.setOptions(
            {
                nextLabel: 'след. >',
                prevLabel: '< пред.',
                doneLabel: 'Выход',
                skipLabel: 'Выход',
                exitOnEsc: true,
                exitOnOverlayClick: false
            });
        this.introJS.start();
        this.introJS.onexit(_ => localStorage.setItem(IntroService.INTRO_VIEWED_KEY, IntroService.INTRO_VIEWED_VALUE));

    }

}
