import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { fabric } from 'fabric';

@Directive({
  selector: '[appScore]',
  standalone: true,
})
export class ScoreDirective {
  @Input() scoreA: number;
  @Input() scoreB: number;
  public canvas: fabric.Canvas;
  @Output() scoreText: EventEmitter<fabric.Text> =
    new EventEmitter<fabric.Text>();

  private static readonly FONT_SIZE_FACTOR = 0.025;
  private static readonly SCORE_TEXT_OFFSET = 30;
  private static readonly SCORE_TEXT_TOP_MARGIN = 10;

  constructor() {}

  ngOnInit(): void {}

  public initScoreText(): void {
    const scoreText = this.createScoreText();
    this.scoreText.emit(scoreText);
  }

  private createScoreText(): fabric.Text {
    const fontSize =
      Math.min(this.canvas.width, this.canvas.height) *
      ScoreDirective.FONT_SIZE_FACTOR;

    const scoreText = new fabric.Text(`${this.scoreA} - ${this.scoreB}`, {
      left: this.canvas.width / 2 - ScoreDirective.SCORE_TEXT_OFFSET,
      top: ScoreDirective.SCORE_TEXT_TOP_MARGIN,
      fontSize,
      fontWeight: 'bold',
      fill: 'white',
    });

    this.canvas.add(scoreText);
    return scoreText;
  }
}
