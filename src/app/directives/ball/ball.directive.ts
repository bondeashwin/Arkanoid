import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { fabric } from 'fabric';

@Directive({
  selector: '[appBall]',
  standalone: true,
})
export class BallDirective implements OnInit {
  public canvas: fabric.Canvas;
  @Output() ball: EventEmitter<fabric.Circle> =
    new EventEmitter<fabric.Circle>();

  constructor() {}

  ngOnInit(): void {}

  public initBall(): void {
    const ball = this.createBall();
    this.ball.emit(ball);
  }

  private createBall(): fabric.Circle {
    const ballRadius = Math.min(this.canvas.width, this.canvas.height) * 0.01;

    const ball = new fabric.Circle({
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      radius: ballRadius,
      fill: 'yellow',
    });

    this.canvas.add(ball);

    return ball;
  }
}
