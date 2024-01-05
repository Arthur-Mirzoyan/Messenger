import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable()
export class ColorService {
  private root = this.appService.isBrowser
    ? document.querySelector(':root')
    : undefined;

  private currentMode: string = 'day';
  private colors = {
    day: {
      '--primary-color': '#988dfb',
      '--secondary-color': '#d3d0ee',
      '--hover-color': '#b6aff5',
      '--background-color': 'white',
    },
    night: {
      '--primary-color': '#988dfb',
      '--secondary-color': '#d3d0ee',
      '--hover-color': '#b6aff5',
      '--background-color': '#2b2b2b',
    },
  };
  private colorModeIcon = {
    day: 'assets/svg/sun.svg',
    night: 'assets/svg/moon.svg',
  };

  public icon: string = this.colorModeIcon.day;

  constructor(private appService: AppService) {
    this.currentMode = this.appService.isBrowser
      ? sessionStorage.getItem('currentColorMode') || 'day'
      : 'day';
  }

  updateColorMode() {
    const colors =
      this.currentMode === 'day' ? this.colors.day : this.colors.night;
    this.icon =
      this.currentMode === 'day'
        ? this.colorModeIcon.day
        : this.colorModeIcon.night;

    for (const [key, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(key, value);
    }
  }

  changeColorMode() {
    if (this.root) {
      let colors;
      if (this.currentMode === 'day') {
        colors = this.colors.night;
        this.currentMode = 'night';
        this.icon = this.colorModeIcon.night;
      } else {
        colors = this.colors.day;
        this.currentMode = 'day';
        this.icon = this.colorModeIcon.day;
      }

      for (const [key, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(key, value);
      }
    }
  }

  get getCurrentMode() {
    return this.currentMode;
  }
}
