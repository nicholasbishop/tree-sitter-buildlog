/**
 * @file Tree-sitter grammar for parsing build logs
 * @author Nicholas Bishop <nbishop@nbishop.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "buildlog",

  // conflicts: $ => [
  //   [$.clang_diag_repeat1, $._arbitrary_word],
  // ],

  extras: $ => [],

  rules: {
    log: $ => repeat(
      choice(
        $.clang_diag2,
        // $.rust_diag,
        $.arbitrary_line,
        // $.arbitrary_lines
        // prec(-10, $.arbitrary_line),
      )
    ),

    rust_diag: $ => seq(
      $.rust_diag_first_line,
      $.rust_where,
    ),

    rust_where: $ => seq(
      '  --> ',
      $.source_ref,
    ),

    clang_diag2: $ => seq(
      /[^\n:]+/,
      /:\d+:\d+: /,
      /error: [^\n]+\n/,
    ),

    clang_diag: $ => seq(
      $.source_ref,
      ': ',
      $.diag_level,
      ': ',
      $.arbitrary_text_no_newline,
      '\n',
    ),

    source_ref: $ => seq(
      $.arbitrary_text_no_newline,
      ':',
      /\d+/,
      optional(
        seq(
          ':',
          /\d+/,
        )
      )
    ),

    path: $ => token(prec(-1, /[^:\n]+/)),

    rust_diag_first_line: $ => seq(
      $.rust_diag_introducer,
      /.*/,
    ),

    rust_diag_introducer: $ => seq(
      $.diag_level,
      optional($._rust_error_code),
      ':'
    ),

    _rust_error_code: $ => seq(
      '[E',
      /\d+/,
      ']'
    ),

    diag_level: $ => choice(
      'error',
      'warning',
      'note',
    ),

    // arbitrary_lines: $ => repeat1($._arbitrary_word),
    // arbitrary_line: $ => seq(
    //   repeat1($._arbitrary_word),
    //   '\n',
    // ),
    arbitrary_word: $ => token(prec(-2, /\S+/)),

    arbitrary_text_no_newline: $ => token(prec(-1, /[^\n]+/)),
    arbitrary_line: $ => seq($.arbitrary_text_no_newline, '\n'),
  }
});
