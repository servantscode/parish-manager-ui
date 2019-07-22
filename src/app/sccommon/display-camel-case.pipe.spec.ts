import { DisplayCamelCasePipe } from './display-camel-case.pipe';

describe('DisplayCamelCasePipe', () => {
  it('create an instance', () => {
    const pipe = new DisplayCamelCasePipe();
    expect(pipe).toBeTruthy();
  });
});
