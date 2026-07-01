import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';

@Directive({ selector: '[appPasswordToggle]', standalone: true })
export class PasswordToggleDirective implements OnInit {
  private visible = false;
  private toggleBtn!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const parent = this.el.nativeElement.parentNode;

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'width', '100%');

    this.renderer.insertBefore(parent, wrapper, this.el.nativeElement);
    this.renderer.appendChild(wrapper, this.el.nativeElement);
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'paddingRight', '2.5rem');

    this.toggleBtn = this.renderer.createElement('i');
    this.renderer.addClass(this.toggleBtn, 'bi');
    this.renderer.addClass(this.toggleBtn, 'bi-eye');
    this.renderer.setStyle(this.toggleBtn, 'position', 'absolute');
    this.renderer.setStyle(this.toggleBtn, 'right', '12px');
    this.renderer.setStyle(this.toggleBtn, 'top', '50%');
    this.renderer.setStyle(this.toggleBtn, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.toggleBtn, 'cursor', 'pointer');
    this.renderer.setStyle(this.toggleBtn, 'color', 'white');
    this.renderer.setStyle(this.toggleBtn, 'z-index', '2');
    this.renderer.setStyle(this.toggleBtn, 'pointerEvents', 'none');
    this.renderer.listen(this.el.nativeElement.parentNode, 'click', (e) => {
      const rect = this.toggleBtn.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        e.stopPropagation();
        e.preventDefault();
        this.toggle();
      }
    });
    this.renderer.appendChild(wrapper, this.toggleBtn);

    this.renderer.listen(this.toggleBtn, 'click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.toggle();
    });
  }

  toggle() {
    this.visible = !this.visible;
    this.el.nativeElement.type = this.visible ? 'text' : 'password';
    if (this.visible) {
      this.renderer.removeClass(this.toggleBtn, 'bi-eye');
      this.renderer.addClass(this.toggleBtn, 'bi-eye-slash');
    } else {
      this.renderer.removeClass(this.toggleBtn, 'bi-eye-slash');
      this.renderer.addClass(this.toggleBtn, 'bi-eye');
    }
  }
}