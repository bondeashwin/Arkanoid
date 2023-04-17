import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { fabric } from 'fabric';

@Directive({
  selector: '[appPaddle]',
  standalone: true,
})
export class PaddleDirective {
  @Input() position: 'left' | 'right';
  @Input() color: string;
  @Input() canvas: fabric.Canvas;
  @Output() paddle: EventEmitter<fabric.Rect> = new EventEmitter<fabric.Rect>();

  constructor() {}

  ngOnInit(): void {}

  public initPaddle(): void {
    const paddle = this.createPaddle();
    this.paddle.emit(paddle);
  }

  private createPaddle(): fabric.Rect {
    const paddleWidth = this.canvas.width * 0.015;
    const paddleHeight = this.canvas.height * 0.15;

    const paddle = new fabric.Rect({
      width: paddleWidth,
      height: paddleHeight,
      fill: this.color,
      left: this.getLeftPosition(paddleWidth),
      top: this.canvas.height / 2 - paddleHeight / 2,
      originY: 'top',
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    this.canvas.add(paddle);

    return paddle;
  }

  private getLeftPosition(paddleWidth: number): number {
    return this.position === 'left' ? 0 : this.canvas.width - paddleWidth;
  }
}
