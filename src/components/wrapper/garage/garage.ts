import { createElement } from '../../painter';
import { Car, Flag } from '../../program-data';
import './garage.scss';
import {
  getCars,
  deleteCar,
  updateCar,
  createCar,
  startEngine,
  drive,
  stopEngine,
  getCar,
  getWinner,
  getWinnerStatus,
  createWinner,
  updateWinner,
  deleteWinner,
} from '../../api';

export class Garage {
  static garage: HTMLElement;

  static selectedCar = 0;

  static rootElement = document.body as HTMLElement;

  static Cars: Promise<{ items: { name: string; color: string; id: number }[]; count: string | null }>;

  static CreateCarName: HTMLElement | HTMLInputElement;

  static CreateCarColor: HTMLElement | HTMLInputElement;

  static UpdateCarName: HTMLElement | HTMLInputElement;

  static UpdateCarColor: HTMLElement | HTMLInputElement;

  static winnerMassage: HTMLElement | HTMLInputElement;

  static UpdateCarErrors: HTMLElement;

  static CreateCarErrors: HTMLElement;

  static UpdateCar: HTMLElement;

  static CarCount = '0';

  static PageNumber = 1;

  static GarageLimit = 7;

  static allStartEngine = [] as Array<HTMLElement | HTMLInputElement>;

  static allStopEngine = [] as Array<HTMLElement | HTMLInputElement>;

  static state = {} as { [x: string]: number };

  static finish = true as boolean;

  static isRace = false as boolean;

  static PrevNextContainer: HTMLElement;

  static createGarage(): HTMLElement {
    this.garage = createElement(this.rootElement, 'div', 'garage');

    this.CreateCarErrors = createElement(this.garage, 'label', 'createCarErrors');
    const createContainer = createElement(this.garage, 'div', 'createContainer');
    this.CreateCarName = createElement(createContainer, 'input', 'inputCarName', 'text');
    this.CreateCarName.addEventListener('input', () => Garage.remove_error(this.CreateCarName, this.CreateCarErrors));
    this.CreateCarColor = createElement(createContainer, 'input', 'inputCarColor', 'color');
    this.CreateCarColor.addEventListener('input', () => Garage.remove_error(this.CreateCarColor, this.CreateCarErrors));
    createElement(createContainer, 'button', 'buttons', '', '', 'CREATE', () => Garage.createCar());

    this.UpdateCarErrors = createElement(this.garage, 'label', 'updateCarErrors');
    const updateContainer = createElement(this.garage, 'div', 'updateContainer');
    this.UpdateCarName = createElement(updateContainer, 'input', 'inputCarName', 'text');
    this.UpdateCarName.setAttribute('disabled', 'false');
    this.UpdateCarName.addEventListener('input', () => Garage.remove_error(this.UpdateCarName, this.UpdateCarErrors));
    this.UpdateCarColor = createElement(updateContainer, 'input', 'inputCarColor', 'color');
    this.UpdateCarColor.setAttribute('disabled', 'false');
    this.UpdateCarColor.addEventListener('input', () => Garage.remove_error(this.UpdateCarColor, this.UpdateCarErrors));
    this.UpdateCar = createElement(updateContainer, 'button', 'buttons', '', '', 'UPDATE', () => Garage.updateCar());
    this.UpdateCar.setAttribute('disabled', 'false');
    this.UpdateCar.classList.add('lockedButton');

    this.winnerMassage = createElement(this.garage, 'span', 'winnerMassage');
    const settings = createElement(this.garage, 'div', 'settings');
    const Rase = createElement(settings, 'button', 'buttons', '', '', 'RASE');
    const Reset = createElement(settings, 'button', 'buttons', '', '', 'RESET', () => Garage.Reset(Rase, Reset));
    Reset.classList.add('lockedButton');
    Reset.setAttribute('disabled', 'false');
    Rase.addEventListener('mousedown', () => Garage.Rase(Rase, Reset));
    createElement(settings, 'button', 'buttons', '', '', 'GENERATE CARS', () => Garage.createHundredCars());
    Garage.createContext();
    return this.garage;
  }

  static createContext(): void {
    this.Cars = getCars(this.PageNumber, this.GarageLimit);
    const title = createElement(this.garage, 'h1', 'title');

    const page = createElement(this.garage, 'h3', 'page');
    page.innerHTML = `Page #${this.PageNumber}`;
    this.Cars.then((value) => {
      if (value.count !== null) {
        this.CarCount = value.count;
        Garage.createPrevNext();
        title.innerHTML = `Garage(${this.CarCount})`;
      }
      const arrCars = value.items;
      arrCars.forEach((element: { name: string; color: string; id: number }): void => {
        Garage.createTrack(this.garage, element.name, element.color, element.id);
      });
    });
  }

  static createTrack(mainElement: HTMLElement, CarName: string, color: string, carId: number): void {
    const Container = createElement(mainElement, 'div', 'Container');
    const settingsCar = createElement(Container, 'div', 'settingsCar');
    const Select = createElement(settingsCar, 'button', 'buttons', '', '', 'SELECT');
    Select.addEventListener('mouseup', () => Garage.selectCar(carId, CarName, color));
    createElement(settingsCar, 'button', 'buttons', '', '', 'REMOVE', () => {
      deleteCar(Number(carId));
      deleteWinner(Number(carId));
      Garage.updatePage();
    });

    const Name = createElement(settingsCar, 'span', 'title');
    Name.innerHTML = CarName[0].toUpperCase() + CarName.slice(1);
    const CarImage = createElement(Container, 'div', 'car');
    CarImage.innerHTML = Car(color);
    const EngineContainer = createElement(Container, 'div', 'EngineContainer');
    const A = createElement(EngineContainer, 'input', 'EngineButtonStart', 'button', 'A');
    const B = createElement(EngineContainer, 'input', 'EngineButtonStop', 'button', 'B');
    A.addEventListener('click', () => Garage.startSelectEngine(Number(carId), Container, CarImage, A, B));
    B.classList.add('lockedEngineButton');
    B.setAttribute('disabled', 'false');
    this.allStartEngine.push(A);
    this.allStopEngine.push(B);
    B.addEventListener('click', () => Garage.stopSelectEngine(CarImage, Number(carId), A, B));
    const FlagImage = createElement(Container, 'div', 'flag');
    FlagImage.innerHTML = Flag();
  }

  static startSelectEngine(
    id: number,
    container: HTMLElement | HTMLInputElement,
    CarImage: HTMLElement | HTMLInputElement,
    StartButton: HTMLElement | HTMLInputElement,
    StopButton: HTMLElement | HTMLInputElement
  ): void {
    const Engine = startEngine(id);
    StartButton.classList.add('lockedEngineButton');
    StartButton.setAttribute('disabled', 'false');
    StopButton.classList.remove('lockedEngineButton');
    StopButton.removeAttribute('disabled');
    Engine.then((value) => {
      const time = Math.round(value.distance / value.velocity);
      const webDistance = container.offsetWidth - CarImage.offsetWidth - CarImage.offsetLeft - 20;
      Garage.carRun(CarImage, time, webDistance, id);
      const Drive = drive(id);
      Drive.then((DriveValue) => {
        if (!DriveValue.success) {
          window.cancelAnimationFrame(this.state[id]);
        }
      });
    });
  }

  static carRun(
    CarImage: HTMLElement | HTMLInputElement,
    AnimationTime: number,
    webDistance: number,
    id: number
  ): void {
    let start = null as unknown as number;
    let time = 0;
    function Step(timestamp: number) {
      if (!start) start = timestamp;
      time = timestamp - start;
      const passed = Math.round(time * (webDistance / AnimationTime));

      CarImage.style.transform = `translateX(${Math.min(passed, webDistance)}px)`;
      if (passed >= webDistance) {
        Garage.getWinners(time, id);
      }
      if (passed < webDistance) {
        Garage.state[id] = window.requestAnimationFrame(Step);
      }
    }
    this.state[id] = window.requestAnimationFrame(Step);
  }

  static stopSelectEngine(
    CarImage: HTMLElement | HTMLInputElement,
    id: number,
    StartButton: HTMLElement | HTMLInputElement,
    StopButton: HTMLElement | HTMLInputElement
  ): void {
    StopButton.classList.add('lockedEngineButton');
    StopButton.setAttribute('disabled', 'false');
    if (this.state[id]) {
      window.cancelAnimationFrame(this.state[id]);
    }
    const stopSelectEngine = stopEngine(id);
    stopSelectEngine.then(() => {
      StartButton.classList.remove('lockedEngineButton');
      StartButton.removeAttribute('disabled');
      CarImage.style.transform = `translateX(0)`;
    });
  }

  static selectCar(carId: number, CarName: string, color: string): void {
    this.selectedCar = carId;
    if (this.UpdateCarName instanceof HTMLInputElement && this.UpdateCarColor instanceof HTMLInputElement) {
      this.UpdateCarName.value = CarName;
      this.UpdateCarName.removeAttribute('disabled');
      this.UpdateCarColor.value = color;
      this.UpdateCarColor.removeAttribute('disabled');
      this.UpdateCar.removeAttribute('disabled');
      this.UpdateCar.classList.remove('lockedButton');
      this.UpdateCarName.select();
      this.UpdateCarName.focus();
      this.UpdateCarName.scrollIntoView();
    }
  }

  static updateCar(): void {
    if (this.UpdateCarName instanceof HTMLInputElement && this.UpdateCarColor instanceof HTMLInputElement) {
      if (Garage.validateInput(this.UpdateCarName, this.UpdateCarColor, this.UpdateCarErrors)) {
        updateCar(Number(this.selectedCar), { name: this.UpdateCarName.value, color: this.UpdateCarColor.value });
        Garage.updatePage();
      }
    }
  }

  static createCar(): void {
    if (this.CreateCarName instanceof HTMLInputElement && this.CreateCarColor instanceof HTMLInputElement) {
      if (Garage.validateInput(this.CreateCarName, this.CreateCarColor, this.CreateCarErrors)) {
        createCar({ name: this.CreateCarName.value, color: this.CreateCarColor.value });
        Garage.updatePage();
      }
    }
  }

  static validateInput(
    inputName: HTMLElement | HTMLInputElement,
    inputColor: HTMLElement | HTMLInputElement,
    labelError: HTMLElement
  ): boolean {
    if (inputName instanceof HTMLInputElement && inputColor instanceof HTMLInputElement) {
      if (inputName.value) {
        if (inputColor.value !== '#000000') {
          return true;
        }
        labelError.innerHTML = 'Invalid color';
        inputColor.classList.add('input-invalid');
      } else {
        labelError.innerHTML = 'Enter the name of the car';
        inputName.classList.add('input-invalid');
      }
    }
    return false;
  }

  static remove_error(Input: HTMLElement | HTMLInputElement, label: HTMLElement): void {
    Input.classList.remove('input-invalid');
    label.textContent = '';
  }

  static createHundredCars(): void {
    const brand = ['Acura', 'Alfa Romeo', 'Audi', 'Bentley', 'BMW', 'Subaru', 'Tesla', ' Mercedes-Benz', 'Jeep'];
    const model = ['NSX', 'TLX A-Spec', 'Giulia Quadrifoglio', 'A6', 'Q7', 'Flying Spur', 'X2', '750Li', 'WRX S4'];
    for (let i = 0; i <= 99; i++) {
      const newColor = `#${`${Math.random().toString(16)}000000`.substring(2, 8).toUpperCase()}`;
      const randomBrand = brand[Math.floor(Math.random() * brand.length)];
      const randomModel = model[Math.floor(Math.random() * model.length)];
      createCar({ name: `${randomBrand} ${randomModel}`, color: newColor });
    }
    Garage.updatePage();
  }

  static deleteElement(): void {
    this.rootElement.removeChild(this.PrevNextContainer);
    this.rootElement.removeChild(this.garage);
  }

  static updatePage(): void {
    this.allStartEngine = [];
    this.allStopEngine = [];
    Garage.deleteElement();
    this.Cars = getCars(this.PageNumber, this.GarageLimit);
    Garage.createGarage();
  }

  static createPrevNext(): void {
    this.PrevNextContainer = createElement(this.rootElement, 'div', 'PrevNextContainer');
    const Prev = createElement(this.PrevNextContainer, 'button', 'buttons', '', '', 'PREV', () => {
      this.PageNumber--;
      Garage.updatePage();
    });

    const Next = createElement(this.PrevNextContainer, 'button', 'buttons', '', '', 'NEXT', () => {
      this.PageNumber++;
      Garage.updatePage();
    });

    if (this.PageNumber === 1) {
      Prev.classList.add('lockedButton');
      Prev.setAttribute('disabled', 'false');
    }
    if (this.PageNumber >= Math.ceil(Number(this.CarCount) / this.GarageLimit)) {
      Next.classList.add('lockedButton');
      Next.setAttribute('disabled', 'false');
    }
  }

  static Rase(Rase: HTMLElement | HTMLInputElement, Reset: HTMLElement | HTMLInputElement): void {
    this.isRace = true;
    Rase.classList.add('lockedButton');
    Rase.setAttribute('disabled', 'false');
    Reset.classList.remove('lockedButton');
    Reset.removeAttribute('disabled');
    this.allStartEngine.forEach((element) => {
      element.click();
    });
  }

  static Reset(Rase: HTMLElement | HTMLInputElement, Reset: HTMLElement | HTMLInputElement): void {
    this.isRace = false;
    this.winnerMassage.innerHTML = '';
    Reset.classList.add('lockedButton');
    Reset.setAttribute('disabled', 'false');
    this.finish = true;
    const promise = new Promise((resolve) => {
      Garage.allStopEngine.forEach((element) => {
        element.click();
      });
      setTimeout(() => resolve(2), 5000);
    });
    promise.then(() => {
      Rase.classList.remove('lockedButton');
      Rase.removeAttribute('disabled');
    });
  }

  static getWinners(time: number, WinId: number): void {
    if (this.finish) {
      if (this.isRace) {
        this.finish = false;
        const newTime = (Math.round(time) / 1000).toFixed(2);
        const getFirstCar = getCar(WinId);
        getFirstCar.then((value) => {
          this.winnerMassage.innerHTML = `${value.name} arrived first (${newTime} s)`;
          const findWinner = getWinnerStatus(WinId);
          findWinner.then((findValue) => {
            if (findValue === 404) {
              createWinner({ id: WinId, wins: 1, time: Number(newTime) });
            } else {
              const getWinCar = getWinner(WinId);
              getWinCar.then((winCar) => {
                const minTime = Number(newTime) < winCar.time ? Number(newTime) : winCar.time;
                updateWinner(WinId, { wins: winCar.wins + 1, time: Number(minTime) });
              });
            }
          });
        });
      }
    }
  }
}
