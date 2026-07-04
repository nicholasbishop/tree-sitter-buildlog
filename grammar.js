/**
 * @file Tree-sitter grammar for parsing build logs
 * @author Nicholas Bishop <nbishop@nbishop.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "buildlog",

  extras: $ => [],

  conflicts: $ => [
    [$.junk_lines],
  ],

  rules: {
    log: $ => repeat(
      choice(
        $.diag,
        $.junk_lines,
      ),
    ),

    junk_lines: $ => repeat1($._junk_line),
    _junk_line: $ => seq(repeat($._junk), '\n'),
    _junk: $ => token(prec(-1, /./)),

    diag: $ => choice(
      $._clang_diag,
      $._rust_diag,
      $._generic_diag,
    ),

    _generic_diag: $ => seq(
      $.diag_level,
      ': ',
      $.message,
      '\n',
    ),

    _clang_diag: $ => seq(
      $.source_ref,
      ': ',
      $.diag_level,
      ': ',
      $.message,
      '\n',
    ),

    _rust_diag: $ => seq(
      $.diag_level,
      $._rust_error_code,
      ': ',
      $.message,
      '\n  --> ',
      $.source_ref,
      '\n',
    ),

    message: $ => /.+/,

    source_ref: $ => token(seq(
      /[^\n]+/,
      ':',
      /\d+/,
      ':',
      /\d+/,
    )),

    _rust_error_code: $ => /\[E\d+\]/,

    diag_level: $ => choice(
      'error',
      'warning',
    ),
  }
});
