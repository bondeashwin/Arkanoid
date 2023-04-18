import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArkanoidComponent } from './arkanoid.component';
import { GameService } from '../../services/game-service/game.service';
import { BallDirective } from '../../directives/ball/ball.directive';
import { PaddleDirective } from '../../directives/paddle/paddle.directive';
import { ScoreDirective } from '../../directives/score/score.directive';

const gameServiceStub = {
  handleKeyEvent: jasmine.createSpy('handleKeyEvent'),
  startGame: jasmine.createSpy('startGame'),
};

const ballDirectiveStub = {
  initBall: jasmine.createSpy('initBall'),
};

const paddleDirectiveStub = {
  initPaddle: jasmine.createSpy('initPaddle'),
};

const scoreDirectiveStub = {
  initScoreText: jasmine.createSpy('initScoreText'),
};

describe('ArkanoidComponent', () => {
  let component: ArkanoidComponent;
  let fixture: ComponentFixture<ArkanoidComponent>;
  let gameService: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkanoidComponent],
      providers: [
        { provide: GameService, useValue: gameServiceStub },
        { provide: BallDirective, useValue: ballDirectiveStub },
        { provide: PaddleDirective, useValue: paddleDirectiveStub },
        { provide: ScoreDirective, useValue: scoreDirectiveStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArkanoidComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleKeyEvent on keydown event', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeyDown(event);
    expect(gameService.handleKeyEvent).toHaveBeenCalledWith(event, true);
  });

  it('should call handleKeyEvent on keyup event', () => {
    const event = new KeyboardEvent('keyup', { key: 'a' });
    component.onKeyUp(event);
    expect(gameService.handleKeyEvent).toHaveBeenCalledWith(event, false);
  });
});
