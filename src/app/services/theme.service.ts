import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  availableClasses: string[] = [];
  currentClassIdx: number = 0;

  bodyClass: string;

  constructor() {
    this.bodyClass = this.availableClasses[this.currentClassIdx];
  }

  setTheme(theme:any){
    // get html body element
    this.availableClasses.push(theme);
    const bodyElement = document.body;

    if (bodyElement) {
      this.currentClassIdx = this.getNextClassIdx();
      const nextClass = this.availableClasses[this.currentClassIdx];
      const activeClass = this.availableClasses[this.getPrevClassIdx()];

      // remove existing class (needed if theme is being changed)
      bodyElement.classList.remove(activeClass);
      // add next theme class
      bodyElement.classList.add(nextClass);

      this.bodyClass = nextClass;
      localStorage.setItem( 'theme' ,this.bodyClass);
    }

  }

  getThemeSelected() {
    return localStorage.getItem('theme');
  }

  getPrevClassIdx(): number {
    return this.currentClassIdx === 0 ? this.availableClasses.length - 1 : this.currentClassIdx - 1;
  }

  getNextClassIdx(): number {
    return this.currentClassIdx === this.availableClasses.length - 1 ? 0 : this.currentClassIdx + 1;
  }
}
