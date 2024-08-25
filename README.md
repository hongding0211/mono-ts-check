**Providing a progressive way to execute a TypeScript check.**

## Why?

Many people use `tsc` with `lint-staged` to execute a TypeScript check during the commit stage. It works well in most cases.

But consider the following situation:
```ts
// a.ts
export const obj = {}
console.log(obj.foo)  // foo does not exist on obj
```

```ts
// b.ts
import { obj } from './a'
```

If you run `tsc` on `b.ts`, it will appear that `b.ts` contains no TypeScript errors. However, you won’t pass the TypeScript check because another error occurred in `a.ts`.

Your project may contain a large number of errors. In this case, it may be impossible to fix all of them during a single commit. Or put another way, you only care about the errors in specific files and want to ignore all other potential errors in other files.

This tool provides a gentler way to solve this problem.

Instead of using `tsc`, this tool only outputs errors based on the files you provide. 

So here, if you run `mono-ts-check` on `b.ts`, you won’t get any errors.

## Setup

> **ONLY TESTED ON TYPESCRIPT 5**

- Install [lint-staged](https://github.com/lint-staged/lint-staged), follow the instructions.

- To install, use:

  ```bash
  npm i -D @hong97/mono-ts-check
  ```

- In package.json, add mono-ts-check to `*.ts`, `*.tsx` files.

  ```json
  "lint-staged": {
    "*.{ts,tsx}": [
      "mono-ts-check"
    ]
  },
  ```

- Use [Husky](https://github.com/typicode/husky) or other methods to set up your git 'pre-commit' hooks.

- Now, TypeScript will be checked at commit staged.


## Configuration

Create a file named `monoTsCheckConfig.js` in your root directory:

```js
module.exports = {
  alwaysInclude: [
    // always included in tsc process no matter these files are staged or not
  ],
  ignore: [
    // use glob pattern, see more: https://www.npmjs.com/package/minimatch
  ],
};
```

You can also set up a callback hook in config file:

```js
module.exports = {
  onFinish: (result) => {
    // ...
  } 
};
```

The callback will be invoked after lint finish running and the results will be passed through.

