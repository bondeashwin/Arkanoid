import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { fabric } from 'fabric';

describe('GameService', () => {
  let service: GameService;
  let canvasStub: jasmine.SpyObj<fabric.Canvas>;

  beforeEach(() => {
    canvasStub = jasmine.createSpyObj('Canvas', ['add', 'remove', 'renderAll']);
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    service.canvas = canvasStub;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
