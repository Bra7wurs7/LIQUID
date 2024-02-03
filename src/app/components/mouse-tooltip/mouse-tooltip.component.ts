import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-mouse-tooltip',
  templateUrl: './mouse-tooltip.component.html',
  styleUrl: './mouse-tooltip.component.scss'
})
export class MouseTooltipComponent {
  @Input() scrollOptions?: string[];
  @Input() activeOption?: number;

}
