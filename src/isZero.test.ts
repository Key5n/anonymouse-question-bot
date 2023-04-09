import { isZero } from './isZero';

test('should be true when passing 0', () => {
  const result = isZero(0);
  expect(result).toBe(true);
});

test('should be false when passing 1', () => {
  const result = isZero(1);
  expect(result).toBe(false);
});
