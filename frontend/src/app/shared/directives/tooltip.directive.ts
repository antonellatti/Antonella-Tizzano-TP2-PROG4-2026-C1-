import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[appTooltip]', standalone: true })
export class TooltipDirective {
  @Input() appTooltip = '';
  private tooltipEl: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, this.tooltipEl);
    this.renderer.setProperty(this.tooltipEl, 'innerText', this.appTooltip);
    this.renderer.setStyle(this.tooltipEl, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipEl, 'background', '#1a1a2e');
    this.renderer.setStyle(this.tooltipEl, 'color', 'white');
    this.renderer.setStyle(this.tooltipEl, 'padding', '0.4rem 0.8rem');
    this.renderer.setStyle(this.tooltipEl, 'border-radius', '8px');
    this.renderer.setStyle(this.tooltipEl, 'font-size', '0.8rem');
    this.renderer.setStyle(this.tooltipEl, 'z-index', '9999');
    this.renderer.setStyle(this.tooltipEl, 'pointer-events', 'none');

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltipEl, 'top', `${rect.top - 36}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${rect.left}px`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}