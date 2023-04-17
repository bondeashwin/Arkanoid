import { Injectable } from '@angular/core';
import { interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public canvas: fabric.Canvas;
  public paddleA: fabric.Rect;
  public paddleB: fabric.Rect;
  public ball: fabric.Circle;
  public scoreText: fabric.Text;
  public scoreA: number = 0;
  public scoreB: number = 0;
  public paddleSpeed = 5;

  private paddleAMovingUp = false;
  private paddleAMovingDown = false;
  private paddleBMovingUp = false;
  private paddleBMovingDown = false;

  constructor() {}

  startGame(): void {
    const ballSpeed = Math.min(this.canvas.width, this.canvas.height) * 0.005;
    this.paddleSpeed = Math.min(this.canvas.width, this.canvas.height) * 0.01;
    let ballVelocityX = ballSpeed;
    let ballVelocityY = ballSpeed;

    interval(1000 / 60)
      .pipe(
        tap(() => {
          this.ball.set({
            left: this.ball.left + ballVelocityX,
            top: this.ball.top + ballVelocityY,
          });

          if (
            this.ball.top <= 0 ||
            this.ball.top + this.ball.height >= this.canvas.height
          ) {
            ballVelocityY = -ballVelocityY;
          }

          if (
            this.checkCollision(this.ball, this.paddleA) ||
            this.checkCollision(this.ball, this.paddleB)
          ) {
            ballVelocityX = -ballVelocityX;
          }

          if (this.ball.left <= 0) {
            this.scoreB++;
            this.resetBall();
          } else if (this.ball.left + this.ball.width >= this.canvas.width) {
            this.scoreA++;
            this.resetBall();
          }

          this.movePaddles();
          this.canvas.renderAll();
          this.updateScore();
        })
      )
      .subscribe();
  }

  private checkCollision(ball: fabric.Circle, paddle: fabric.Rect): boolean {
    const ballRadius = ball.radius;
    const ballX = ball.left + ballRadius;
    const ballY = ball.top + ballRadius;

    const paddleLeft = paddle.left;
    const paddleRight = paddle.left + paddle.width;
    const paddleTop = paddle.top;
    const paddleBottom = paddle.top + paddle.height;

    // Check horizontal collision
    const horizontalCollision =
      (ballX + ballRadius >= paddleLeft && ballX - ballRadius <= paddleRight) ||
      (ballX + ballRadius >= paddleLeft && ballX - ballRadius <= paddleRight);

    // Check vertical collision
    const verticalCollision =
      (ballY + ballRadius >= paddleTop && ballY - ballRadius <= paddleBottom) ||
      (ballY + ballRadius >= paddleTop && ballY - ballRadius <= paddleBottom);

    return horizontalCollision && verticalCollision;
  }

  private movePaddles(): void {
    if (this.paddleAMovingUp && this.paddleA.top > 0) {
      this.paddleA.top -= this.paddleSpeed;
    }
    if (
      this.paddleAMovingDown &&
      this.paddleA.top + this.paddleA.height < this.canvas.height
    ) {
      this.paddleA.top += this.paddleSpeed;
    }
    if (this.paddleBMovingUp && this.paddleB.top > 0) {
      this.paddleB.top -= this.paddleSpeed;
    }
    if (
      this.paddleBMovingDown &&
      this.paddleB.top + this.paddleB.height < this.canvas.height
    ) {
      this.paddleB.top += this.paddleSpeed;
    }
  }

  private resetBall(): void {
    this.ball.set({
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
    });

    this.canvas.renderAll();
  }

  private updateScore(): void {
    this.scoreText.set({ text: `${this.scoreA} - ${this.scoreB}` });
  }
}
