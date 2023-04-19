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

  private static readonly PADDLE_WIDTH_FACTOR = 0.015;
  private static readonly PADDLE_HEIGHT_FACTOR = 0.15;

  constructor() {}

  ngOnInit(): void {}

  public initPaddle(): void {
    const paddle = this.createPaddle();
    this.paddle.emit(paddle);
  }

  private createPaddle(): fabric.Rect {
    const paddleWidth = this.canvas.width * PaddleDirective.PADDLE_WIDTH_FACTOR;
    const paddleHeight =
      this.canvas.height * PaddleDirective.PADDLE_HEIGHT_FACTOR;

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
