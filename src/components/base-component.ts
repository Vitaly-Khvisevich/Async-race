export class BaseComponent {
  public element!: HTMLElement;

  create(tag: keyof HTMLElementTagNameMap = 'div', styles: string[] = []): void {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }
}
