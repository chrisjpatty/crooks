import pkg from "./package.json";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    external: ["react", "react-dom"],
    output: [
      {
        name: "crooks",
        file: pkg.browser,
        format: "umd",
      },
      {
        name: "crooks",
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        name: "crooks",
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      babel({
        extensions: [".js", ".ts", ".tsx"],
        exclude: "node_modules/**",
        babelHelpers: "runtime",
        plugins: ["@babel/plugin-transform-runtime"],
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      commonjs(),
    ],
  },
];
