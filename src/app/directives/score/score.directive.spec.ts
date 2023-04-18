import { ScoreDirective } from './score.directive';

const canvasStub = {
  add: jasmine.createSpy('add'),
  width: 100,
  height: 100,
};

describe('ScoreDirective', () => {
  let directive: ScoreDirective;

  beforeEach(() => {
    directive = new ScoreDirective();
    directive.canvas = canvasStub as any;
  });

  it('should create an instance', () => {
    const directive = new ScoreDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit scoreText when initScoreText is called', () => {
    const scoreTextSpy = spyOn(directive.scoreText, 'emit');
    directive.initScoreText();
    expect(scoreTextSpy).toHaveBeenCalled();
  });
});
