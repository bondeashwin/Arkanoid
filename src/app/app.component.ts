import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fabric } from 'fabric';
import { interval, tap } from 'rxjs';
import { BallDirective } from './directives/ball/ball.directive';
import { PaddleDirective } from './directives/paddle/paddle.directive';
import { ScoreDirective } from './directives/score/score.directive';
import { GameService } from './services/game.service';

const PADDLE_WIDTH_RATIO = 0.01;
const PADDLE_HEIGHT_RATIO = 0.1;
const BALL_RADIUS_RATIO = 0.01;
const FONT_SIZE_RATIO = 0.025;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [BallDirective, PaddleDirective, ScoreDirective, RouterOutlet],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('arkanoidCanvas') arkanoidCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(BallDirective) ballDirective: BallDirective;
  @ViewChild(ScoreDirective) scoreDirective: ScoreDirective;
  @ViewChild('leftPaddle', { read: PaddleDirective })
  paddleLeftDirective: PaddleDirective;
  @ViewChild('rightPaddle', { read: PaddleDirective })
  paddleRightDirective: PaddleDirective;

  private canvas: fabric.Canvas;
  private paddleA: fabric.Rect;
  private paddleB: fabric.Rect;
  private ball: fabric.Circle;
  private scoreText: fabric.Text;
  public scoreA: number = 0;
  public scoreB: number = 0;
  private paddleSpeed = 5;

  private paddleAMovingUp = false;
  private paddleAMovingDown = false;
  private paddleBMovingUp = false;
  private paddleBMovingDown = false;

  constructor(private _zone: NgZone, private gameService: GameService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._zone.runOutsideAngular(() => {
      this.initCanvas();
      this.setCanvas();
      this.startGame();
    });
  }

  private setCanvas(): void {
    this.ballDirective.canvas = this.canvas;
    this.scoreDirective.canvas = this.canvas;
    this.paddleLeftDirective.canvas = this.canvas;
    this.paddleRightDirective.canvas = this.canvas;

    // Initialize elements after setting the canvas
    this.ballDirective.initBall();
    this.scoreDirective.initScoreText();
    this.paddleLeftDirective.initPaddle();
    this.paddleRightDirective.initPaddle();
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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
        this.paddleAMovingUp = true;
        break;
      case 'KeyS':
        this.paddleAMovingDown = true;
        break;
      case 'ArrowUp':
        this.paddleBMovingUp = true;
        break;
      case 'ArrowDown':
        this.paddleBMovingDown = true;
        break;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
        this.paddleAMovingUp = false;
        break;
      case 'KeyS':
        this.paddleAMovingDown = false;
        break;
      case 'ArrowUp':
        this.paddleBMovingUp = false;
        break;
      case 'ArrowDown':
        this.paddleBMovingDown = false;
        break;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCanvasSize();
    this.updateGameElements();
  }

  private updateCanvasSize(): void {
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
  }

  private updateGameElements(): void {
    const paddleWidth = this.canvas.width * PADDLE_WIDTH_RATIO;
    const paddleHeight = this.canvas.height * PADDLE_HEIGHT_RATIO;

    this.paddleA.set({
      left: paddleWidth,
      top: this.canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
    });

    this.paddleB.set({
      left: this.canvas.width - paddleWidth * 2,
      top: this.canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
    });

    const ballRadius =
      Math.min(this.canvas.width, this.canvas.height) * BALL_RADIUS_RATIO;

    this.ball.set({
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      radius: ballRadius,
    });

    const fontSize =
      Math.min(this.canvas.width, this.canvas.height) * FONT_SIZE_RATIO;

    this.scoreText.set({
      left: this.canvas.width / 2 - 30,
      top: 10,
      fontSize,
    });

    this.canvas.renderAll();
  }

  private initCanvas(): void {
    this.canvas = new fabric.Canvas(this.arkanoidCanvas.nativeElement, {
      selection: false,
      renderOnAddRemove: false,
      backgroundColor: 'black',
    });

    this.updateCanvasSize();
  }

  private startGame(): void {
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
