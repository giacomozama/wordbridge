# Wordbridge

A word-ladder puzzle game. Change one letter at a time (or reverse the previous word) to bridge from a start word to a target word, using only valid dictionary words.

Play it at **https://giacomozama.github.io/wordbridge/**

## Rules

1. You start on a start word and must reach the target word.
2. Each step must be a word in the dictionary.
3. Each step must differ from the previous word by exactly one letter.
4. You can also reverse the previous word, as long as it forms a valid word.
5. Reach the target word to win. Try to do it in as few steps as possible.

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run check     # type-check with svelte-check
```

## License

[MIT](LICENSE)
