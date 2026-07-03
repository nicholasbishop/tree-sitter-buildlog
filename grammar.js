/**
 * @file Tree-sitter grammar for parsing build logs
 * @author Nicholas Bishop <nbishop@nbishop.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "buildlog",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
