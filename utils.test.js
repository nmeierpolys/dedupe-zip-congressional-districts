import { sanitizeNonUSZipCode, sanitizeUSZipCode } from './utils.js';
import assert from 'assert';

describe('sanitizeUSZipCode', () => {
  it('should return null if zipCode is null', () => {
    assert.equal(sanitizeUSZipCode(null), null);
  });

  it('should return - if zipCode is 0', () => {
    assert.equal(sanitizeUSZipCode(0), '-');
  });

  it('should return - if zipCode is "0"', () => {
    assert.equal(sanitizeUSZipCode('0'), '-');
  });

  it('should return - if zipCode is "-"', () => {
    assert.equal(sanitizeUSZipCode('-'), '-');
  });

  it('should return zipCode if zipCode is a number', () => {
    assert.equal(sanitizeUSZipCode(12345), 12345);
  });

  it('should return zipCode if zipCode is a string', () => {
    assert.equal(sanitizeUSZipCode('12345'), '12345');
  });

  it('should return a padded zipCode if zipCode numeric but less than 5 digits', () => {
    assert.equal(sanitizeUSZipCode(1), '00001');
    assert.equal(sanitizeUSZipCode(12), '00012');
    assert.equal(sanitizeUSZipCode(123), '00123');
    assert.equal(sanitizeUSZipCode(1234), '01234');
    assert.equal(sanitizeUSZipCode('1'), '00001');
    assert.equal(sanitizeUSZipCode('12'), '00012');
    assert.equal(sanitizeUSZipCode('123'), '00123');
    assert.equal(sanitizeUSZipCode('1234'), '01234');
  });
});

describe('sanitizeNonUSZipCode', () => {
  it('should return - if zipCode is 0', () => {
    assert.equal(sanitizeNonUSZipCode(0), '-');
  });

  it('should return - if zipCode is "0"', () => {
    assert.equal(sanitizeNonUSZipCode('0'), '-');
  });

  it('should return - if zipCode is "-"', () => {
    assert.equal(sanitizeNonUSZipCode('-'), '-');
  });

  it('should return zipCode if zipCode is a number', () => {
    assert.equal(sanitizeNonUSZipCode(12345), 12345);
  });

  it('should return zipCode if zipCode is a string', () => {
    assert.equal(sanitizeNonUSZipCode('12345'), '12345');
  });
});
