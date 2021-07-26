import './style.scss';
import { General } from './components/wrapper/wrapper';
import { Garage } from './components/wrapper/garage/garage';
import { Winners } from './components/wrapper/winners/winners';

window.onload = () => {
  const appElement = document.body;
  if (!appElement) throw Error('App root element not found');
  const general = new General();
  const generalElement = general.create();
  General.GarageButton.classList.add('lockedButton');
  appElement.appendChild(generalElement);
  Garage.createGarage();
  Winners.createWinners();
  Winners.winners.classList.add('non_visible');
  Winners.WinPrevNextContainer.classList.add('non_visible');
};
