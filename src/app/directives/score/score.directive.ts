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

  constructor() {}

  ngOnInit(): void {}

  public initScoreText(): void {
    const scoreText = this.createScoreText();
    this.scoreText.emit(scoreText);
  }

  private createScoreText(): fabric.Text {
    const fontSize = Math.min(this.canvas.width, this.canvas.height) * 0.025;

    const scoreText = new fabric.Text(`${this.scoreA} - ${this.scoreB}`, {
      left: this.canvas.width / 2 - 30,
      top: 10,
      fontSize,
      fontWeight: 'bold',
      fill: 'white',
    });

    this.canvas.add(scoreText);
    return scoreText;
  }
}
