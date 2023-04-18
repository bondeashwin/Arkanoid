import { BallDirective } from './ball.directive';

const canvasStub = {
  add: jasmine.createSpy('add'),
  width: 100,
  height: 100,
};

describe('BallDirective', () => {
  let directive: BallDirective;

  beforeEach(() => {
    directive = new BallDirective();
    directive.canvas = canvasStub as any;
  });

  it('should create an instance', () => {
    const directive = new BallDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit ball when initBall is called', () => {
    const ballSpy = spyOn(directive.ball, 'emit');
    directive.initBall();
    expect(ballSpy).toHaveBeenCalled();
  });
});
