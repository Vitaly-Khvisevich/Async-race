import { BaseComponent } from '../base-component';
import './wrapper.scss';
import { createElement } from '../painter';
import { Garage } from './garage/garage';
import { Winners } from './winners/winners';

export class General extends BaseComponent {
  static GarageButton: HTMLElement;

  static WinnersButton: HTMLElement;

  create(): HTMLElement {
    super.create('div', ['general']);
    const buttonContainer = createElement(this.element, 'div', 'buttonContainer');
    General.GarageButton = createElement(buttonContainer, 'button', 'buttons', '', '', 'TO GARAGE', () =>
      General.showGarage()
    );
    General.WinnersButton = createElement(buttonContainer, 'button', 'buttons', '', '', 'TO WINNERS', () =>
      General.showWinners()
    );
    return this.element;
  }

  static showGarage(): void {
    Garage.garage.classList.remove('non_visible');
    Garage.PrevNextContainer.classList.remove('non_visible');
    Winners.winners.classList.add('non_visible');
    this.GarageButton.classList.add('lockedButton');
    this.WinnersButton.classList.remove('lockedButton');
    Winners.WinPrevNextContainer.classList.add('non_visible');
  }

  static showWinners(): void {
    Winners.createWinners();
    Garage.garage.classList.add('non_visible');
    Garage.PrevNextContainer.classList.add('non_visible');
    Winners.winners.classList.remove('non_visible');
    this.WinnersButton.classList.add('lockedButton');
    this.GarageButton.classList.remove('lockedButton');
    Winners.WinPrevNextContainer.classList.remove('non_visible');
  }
}
