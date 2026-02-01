# Time Weaver

A lightweight time calculator for aviation logbooks. It helps you sum and adjust flight time quickly using simple expressions, then view results in HH:MM or decimal formats commonly used in logbooks.

## Features

- Expression input like `1+1:30+:45-0:15`
- Quick add/subtract buttons for hours and minutes
- Results in HH:MM and aviation decimal formats (N.N and N.NN)
- History of recent calculations
- Works as a fast, single-page web app

## Usage

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

## Notes

For aviation use, you can toggle between:
- **Decimal (N.N)**: rounded to tenths of an hour (6-minute blocks)
- **Decimal (N.NN)**: exact minutes / 60 (two decimals)

Use the format that matches your logbook or operator requirements.
