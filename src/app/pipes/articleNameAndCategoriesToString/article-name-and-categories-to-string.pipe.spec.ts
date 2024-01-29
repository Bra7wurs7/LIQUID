import { ArticleNameAndCategoriesToStringPipe } from './article-name-and-categories-to-string.pipe';

describe('ArticleNameAndCategoriesToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ArticleNameAndCategoriesToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
