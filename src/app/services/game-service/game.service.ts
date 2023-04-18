import { Injectable } from '@angular/core';
import { interval, tap } from 'rxjs';
import { fabric } from 'fabric';

enum KeyCodes {
  KeyW = 'KeyW',
  KeyS = 'KeyS',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
}

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

  public paddleAMovingUp = false;
  public paddleAMovingDown = false;
  public paddleBMovingUp = false;
  public paddleBMovingDown = false;

  private static readonly FRAMES_PER_SECOND = 60;
  private static readonly INTERVAL_MS = 1000 / GameService.FRAMES_PER_SECOND;
  private static readonly BALL_SPEED_FACTOR = 0.005;
  private static readonly PADDLE_SPEED_FACTOR = 0.01;

  constructor() {}

  public startGame(): void {
    const ballSpeed = this.calculateBallSpeed();
    this.paddleSpeed = this.calculatePaddleSpeed();
    let ballVelocityX = ballSpeed;
    let ballVelocityY = ballSpeed;

    interval(GameService.INTERVAL_MS)
      .pipe(
        tap(() => {
          this.moveBall(ballVelocityX, ballVelocityY);
          ballVelocityY = this.handleWallCollisions(ballVelocityY);
          ballVelocityX = this.handlePaddleCollisions(ballVelocityX);
          this.handleScoring();
          this.movePaddles();
          this.canvas.renderAll();
          this.updateScore();
        })
      )
      .subscribe();
  }

  public handleKeyEvent(event: KeyboardEvent, isKeyDown: boolean): void {
    switch (event.code) {
      case KeyCodes.KeyW:
        this.paddleAMovingUp = isKeyDown;
        break;
      case KeyCodes.KeyS:
        this.paddleAMovingDown = isKeyDown;
        break;
      case KeyCodes.ArrowUp:
        this.paddleBMovingUp = isKeyDown;
        break;
      case KeyCodes.ArrowDown:
        this.paddleBMovingDown = isKeyDown;
        break;
    }
  }

  private calculateBallSpeed(): number {
    return (
      Math.min(this.canvas.width, this.canvas.height) *
      GameService.BALL_SPEED_FACTOR
    );
  }

  private calculatePaddleSpeed(): number {
    return (
      Math.min(this.canvas.width, this.canvas.height) *
      GameService.PADDLE_SPEED_FACTOR
    );
  }

  private moveBall(ballVelocityX: number, ballVelocityY: number): void {
    this.ball.set({
      left: this.ball.left + ballVelocityX,
      top: this.ball.top + ballVelocityY,
    });
  }

  private handleWallCollisions(ballVelocityY: number): number {
    if (
      this.ball.top <= 0 ||
      this.ball.top + this.ball.height >= this.canvas.height
    ) {
      return -ballVelocityY;
    }
    return ballVelocityY;
  }

  private handlePaddleCollisions(ballVelocityX: number): number {
    if (
      this.checkCollision(this.ball, this.paddleA) ||
      this.checkCollision(this.ball, this.paddleB)
    ) {
      return -ballVelocityX;
    }
    return ballVelocityX;
  }

  private handleScoring(): void {
    if (this.ball.left <= 0) {
      this.scoreB++;
      this.resetBall();
    } else if (this.ball.left + this.ball.width >= this.canvas.width) {
      this.scoreA++;
      this.resetBall();
    }
  }

  private checkCollision(ball: fabric.Circle, paddle: fabric.Rect): boolean {
    const ballCenter = this.getBallCenter(ball);
    const paddleEdges = this.getPaddleEdges(paddle);

    return (
      this.isHorizontallyColliding(ballCenter, ball.radius, paddleEdges) &&
      this.isVerticallyColliding(ballCenter, ball.radius, paddleEdges)
    );
  }

  private getBallCenter(ball: fabric.Circle): { x: number; y: number } {
    return {
      x: ball.left + ball.radius,
      y: ball.top + ball.radius,
    };
  }

  private getPaddleEdges(paddle: fabric.Rect): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return {
      left: paddle.left,
      right: paddle.left + paddle.width,
      top: paddle.top,
      bottom: paddle.top + paddle.height,
    };
  }

  private isHorizontallyColliding(
    ballCenter: { x: number; y: number },
    ballRadius: number,
    paddleEdges: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return (
      (ballCenter.x + ballRadius >= paddleEdges.left &&
        ballCenter.x - ballRadius <= paddleEdges.right) ||
      (ballCenter.x + ballRadius >= paddleEdges.left &&
        ballCenter.x - ballRadius <= paddleEdges.right)
    );
  }

  private isVerticallyColliding(
    ballCenter: { x: number; y: number },
    ballRadius: number,
    paddleEdges: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return (
      (ballCenter.y + ballRadius >= paddleEdges.top &&
        ballCenter.y - ballRadius <= paddleEdges.bottom) ||
      (ballCenter.y + ballRadius >= paddleEdges.top &&
        ballCenter.y - ballRadius <= paddleEdges.bottom)
    );
  }

  private movePaddles(): void {
    this.movePaddle(this.paddleA, this.paddleAMovingUp, this.paddleAMovingDown);
    this.movePaddle(this.paddleB, this.paddleBMovingUp, this.paddleBMovingDown);
  }

  private movePaddle(
    paddle: fabric.Rect,
    movingUp: boolean,
    movingDown: boolean
  ): void {
    if (movingUp && paddle.top > 0) {
      paddle.top -= this.paddleSpeed;
    }

    if (movingDown && paddle.top + paddle.height < this.canvas.height) {
      paddle.top += this.paddleSpeed;
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

  setPaddleA(paddle: fabric.Rect): void {
    this.paddleA = paddle;
  }

  setPaddleB(paddle: fabric.Rect): void {
    this.paddleB = paddle;
  }

  setBall(ball: fabric.Circle): void {
    this.ball = ball;
  }

  setScoreText(scoreText: fabric.Text): void {
    this.scoreText = scoreText;
  }
}
