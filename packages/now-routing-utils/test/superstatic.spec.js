const {
  convertCleanUrls,
  convertRedirects,
  convertRewrites,
} = require('../dist/superstatic');
const { deepEqual } = require('assert');

test('convertCleanUrls', () => {
  const actual = convertCleanUrls([
    'file.txt',
    'path/to/file.txt',
    'file.js',
    'path/to/file.js',
    'file.html',
    'path/to/file.html',
  ]);
  const expected = [
    { src: 'file', dest: 'file.html' },
    { src: 'path/to/file', dest: 'path/to/file.html' },
    {
      src: 'file.html',
      headers: { Location: 'file' },
      status: 301,
    },
    {
      src: 'path/to/file.html',
      headers: { Location: 'path/to/file' },
      status: 301,
    },
  ];
  deepEqual(actual, expected);
});

test('convertRedirects', () => {
  const actual = convertRedirects([
    { source: '/some/old/path', destination: '/some/new/path' },
    {
      source: '/firebase/*',
      destination: 'https://www.firebase.com',
      type: 302,
    },
    { source: 'app/**', destination: '/application.html' },
    { source: 'projects/*/edit', destination: '/projects.html' },
    { source: '/old/:segment/path', destination: '/new/path/:segment' },
  ]);

  const expected = [
    {
      src: '/some/old/path',
      headers: { Location: '/some/new/path' },
      status: 301,
    },
    {
      src: '/firebase/[^/]+',
      headers: { Location: 'https://www.firebase.com' },
      status: 302,
    },
    { src: 'app/.*', headers: { Location: '/application.html' }, status: 301 },
    {
      src: 'projects/[^/]+/edit',
      headers: { Location: '/projects.html' },
      status: 301,
    },
    {
      src: '/old/(?<segment>[^/]+)/path',
      headers: { Location: '/new/path/$segment' },
      status: 301,
    },
  ];

  deepEqual(actual, expected);
});

test('convertRewrites', () => {
  const actual = convertRewrites([
    { source: '/some/old/path', destination: '/some/new/path' },
    { source: '/firebase/*', destination: 'https://www.firebase.com' },
    { source: 'app/**', destination: '/application.html' },
    { source: 'projects/*/edit', destination: '/projects.html' },
  ]);

  const expected = [
    { src: '/some/old/path', dest: '/some/new/path' },
    { src: '/firebase/[^/]+', dest: 'https://www.firebase.com' },
    { src: 'app/.*', dest: '/application.html' },
    { src: 'projects/[^/]+/edit', dest: '/projects.html' },
  ];

  deepEqual(actual, expected);
});
