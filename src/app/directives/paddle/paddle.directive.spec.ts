import { PaddleDirective } from './paddle.directive';

const canvasStub = {
  add: jasmine.createSpy('add'),
  width: 100,
  height: 100,
};

describe('PaddleDirective', () => {
  let directive: PaddleDirective;

  beforeEach(() => {
    directive = new PaddleDirective();
    directive.canvas = canvasStub as any;
  });

  it('should create an instance', () => {
    const directive = new PaddleDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit paddle when initPaddle is called', () => {
    const paddleSpy = spyOn(directive.paddle, 'emit');
    directive.initPaddle();
    expect(paddleSpy).toHaveBeenCalled();
  });
});
