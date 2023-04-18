import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import { BallDirective } from '../../directives/ball/ball.directive';
import { PaddleDirective } from '../../directives/paddle/paddle.directive';
import { ScoreDirective } from '../../directives/score/score.directive';
import { GameService } from '../../services/game-service/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arkanoid',
  standalone: true,
  imports: [CommonModule, BallDirective, PaddleDirective, ScoreDirective],
  templateUrl: './arkanoid.component.html',
  styleUrls: ['./arkanoid.component.scss'],
})
export class ArkanoidComponent implements AfterViewInit {
  @ViewChild('arkanoidCanvas') arkanoidCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(BallDirective) ballDirective: BallDirective;
  @ViewChild(ScoreDirective) scoreDirective: ScoreDirective;
  @ViewChild('leftPaddle', { read: PaddleDirective })
  paddleLeftDirective: PaddleDirective;
  @ViewChild('rightPaddle', { read: PaddleDirective })
  paddleRightDirective: PaddleDirective;

  constructor(private _zone: NgZone, public gameService: GameService) {}

  ngAfterViewInit(): void {
    this._zone.runOutsideAngular(() => {
      this.initCanvas();
      this.setCanvas();
      this.gameService.startGame();
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.gameService.handleKeyEvent(event, true);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.gameService.handleKeyEvent(event, false);
  }

  private initCanvas(): void {
    this.gameService.canvas = new fabric.Canvas(
      this.arkanoidCanvas.nativeElement,
      {
        selection: false,
        renderOnAddRemove: false,
        backgroundColor: 'black',
      }
    );

    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    this.gameService.canvas.setWidth(window.innerWidth);
    this.gameService.canvas.setHeight(window.innerHeight);
  }

  private setCanvas(): void {
    this.setDirectiveCanvasAndInit(this.ballDirective, () =>
      this.ballDirective.initBall()
    );
    this.setDirectiveCanvasAndInit(this.scoreDirective, () =>
      this.scoreDirective.initScoreText()
    );
    this.setDirectiveCanvasAndInit(this.paddleLeftDirective, () =>
      this.paddleLeftDirective.initPaddle()
    );
    this.setDirectiveCanvasAndInit(this.paddleRightDirective, () =>
      this.paddleRightDirective.initPaddle()
    );
  }

  private setDirectiveCanvasAndInit(directive: any, initFn: () => void): void {
    directive.canvas = this.gameService.canvas;
    initFn();
  }
}
