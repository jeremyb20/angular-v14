import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class TranslationService {
    browserLang: any;

    constructor(public translate: TranslateService) {
        translate.addLangs(['en', 'es']);
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(localStorage.getItem('lang')!);
    }
  
    setTranslate(lang:any){
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        localStorage.setItem( 'lang' ,lang);
    }
   
    getLangs() {
        return this.translate.getLangs();
    }

    currentLang(){
        return this.translate.currentLang;
    }

    getTranslate() {
        return localStorage.getItem('lang');
    }
}