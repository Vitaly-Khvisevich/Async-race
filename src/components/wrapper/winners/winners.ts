import { getWinners } from '../../api';
import { createElement } from '../../painter';
import { Car } from '../../program-data';
import './winners.scss';

export class Winners {
  static tableWinners: HTMLElement | HTMLInputElement;

  static CarWinners: Promise<{
    items: { id: number; wins: number; time: number; car: { name: string; color: string; id: number } }[];
    count: string | null;
  }>;

  static rootElement = document.body as HTMLElement;

  static winners: HTMLElement;

  static WinPrevNextContainer: HTMLElement;

  static PageNumber = 1;

  static WinnerCount = '1';

  static WinnerLimit = 10;

  static title: HTMLElement;

  static fieldSort = 'id' as string;

  static sortOrder = 'ASC' as string;

  static numberCar = 0;

  static createWinners(): HTMLElement {
    this.winners = createElement(this.rootElement, 'div', 'winners');

    this.title = createElement(this.winners, 'h1', 'title');

    const page = createElement(this.winners, 'h3', 'page');
    page.innerHTML = `Page#${this.PageNumber}`;
    Winners.createTable(this.winners);
    return this.winners;
  }

  static createTable(winners: HTMLElement): void {
    this.tableWinners = createElement(winners, 'table', 'table');
    const tableTitle = createElement(this.tableWinners, 'tr', 'tableTitleCont');
    const tableOne = createElement(tableTitle, 'th', 'tableTitle');
    tableOne.innerHTML = 'NUMBER';
    const tableTwo = createElement(tableTitle, 'th', 'tableTitle');
    tableTwo.innerHTML = 'CAR';
    const tableThree = createElement(tableTitle, 'th', 'tableTitle');
    tableThree.innerHTML = 'Name';
    const tableFour = createElement(tableTitle, 'th', 'tableTitle');
    tableFour.innerHTML = 'WINS';
    tableFour.classList.add('sortRow');
    tableFour.addEventListener('mousedown', () => {
      this.fieldSort = 'wins';
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      this.CarWinners = getWinners({
        page: this.PageNumber,
        limit: this.WinnerLimit,
        sort: this.fieldSort,
        order: this.sortOrder,
      });
      Winners.updatePage();
    });
    const tableFive = createElement(tableTitle, 'th', 'tableTitle');
    tableFive.innerHTML = 'BEST TIME (seconds)';
    tableFive.classList.add('sortRow');
    tableFive.addEventListener('mousedown', () => {
      this.fieldSort = 'time';
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      this.CarWinners = getWinners({
        page: this.PageNumber,
        limit: this.WinnerLimit,
        sort: this.fieldSort,
        order: this.sortOrder,
      });
      Winners.updatePage();
    });
    this.createContext();
    this.createPrevNext();
  }

  static createContext(): void {
    this.CarWinners = getWinners({
      page: this.PageNumber,
      limit: this.WinnerLimit,
      sort: this.fieldSort,
      order: this.sortOrder,
    });
    this.CarWinners.then((value) => {
      if (value.count !== null) this.WinnerCount = String(value.count);
      this.title.innerHTML = `Winners(${this.WinnerCount})`;
      const arrWins = value.items;
      arrWins.forEach((element, index) => {
        this.createRow(Car(element.car.color), element.car.name, element.wins, element.time, index + 1);
      });
    });
  }

  static updatePage(): void {
    Winners.deletePage();
    this.CarWinners = getWinners({
      page: this.PageNumber,
      limit: this.WinnerLimit,
      sort: this.fieldSort,
      order: this.sortOrder,
    });
    Winners.createWinners();
  }

  static createRow(car: string, name: string, wins: number, best: number, index: number): void {
    const tableRow = createElement(this.tableWinners, 'tr', 'tableRow');
    const tableDataNumber = createElement(tableRow, 'td', 'tableData');
    tableDataNumber.innerHTML = String(index);
    const tableDataCar = createElement(tableRow, 'td', 'tableData');
    tableDataCar.innerHTML = car;
    const tableDataName = createElement(tableRow, 'td', 'tableData');
    tableDataName.innerHTML = name;
    const tableDataWins = createElement(tableRow, 'td', 'tableData');
    tableDataWins.innerHTML = String(wins);
    const tableDataBest = createElement(tableRow, 'td', 'tableData');
    tableDataBest.innerHTML = String(best);
  }

  static deletePage(): void {
    this.rootElement.removeChild(this.WinPrevNextContainer);
    this.rootElement.removeChild(this.winners);
  }

  static createPrevNext(): void {
    this.WinPrevNextContainer = createElement(this.rootElement, 'div', 'PrevNextContainer');
    const Prev = createElement(this.WinPrevNextContainer, 'button', 'buttons', '', '', 'PREV', () => {
      this.PageNumber--;
      Winners.updatePage();
    });

    if (this.PageNumber === 1) {
      Prev.classList.add('lockedButton');
      Prev.setAttribute('disabled', 'false');
    }
    const Next = createElement(this.WinPrevNextContainer, 'button', 'buttons', '', '', 'NEXT', () => {
      this.PageNumber++;
      Winners.updatePage();
    });

    if (this.PageNumber >= Math.ceil(Number(this.WinnerCount) / this.WinnerLimit)) {
      Next.classList.add('lockedButton');
      Next.setAttribute('disabled', 'false');
    }
  }
}
