import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appHoverHighlight]', standalone: true })
export class HoverHighlightDirective {
  @Input() appHoverHighlight = '#f0eeff';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHoverHighlight;
    this.el.nativeElement.style.transition = 'background-color 0.2s';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}