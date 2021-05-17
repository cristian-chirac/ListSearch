import { EmphasizePatternPipe } from './emphasize-pattern.pipe';

describe('EmphasizePatternPipe', () => {
  const SAMPLE_TEXT = 'veritatis pariatur delectus';
  const PATTERN = 'delectus';
  const RESULT_TEXT = 'veritatis pariatur <strong>delectus</strong>';

  it('create an instance', () => {
    const pipe = new EmphasizePatternPipe();
    expect(pipe).toBeTruthy();
  });

  it('does not change text on empty pattern', () => {
    const pipe = new EmphasizePatternPipe();
    expect(pipe.transform(SAMPLE_TEXT, '')).toEqual(SAMPLE_TEXT);
  });

  it('does not change text on pattern not present in text', () => {
    const pipe = new EmphasizePatternPipe();
    expect(pipe.transform(SAMPLE_TEXT, 'hello')).toEqual(SAMPLE_TEXT);
  });

  it('emphasizes text in ', () => {
    const pipe = new EmphasizePatternPipe();
    expect(pipe.transform(SAMPLE_TEXT, PATTERN)).toEqual(RESULT_TEXT);
  });
});
