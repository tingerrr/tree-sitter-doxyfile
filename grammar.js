/**
 * @file A tree sitter grammar for Doxyfiles
 * @author tinger <tinger@tinger.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

// @ts-check

module.exports = grammar({
  name: "doxyfile",

  extras: _ => [
    " ",
    "\t",
    "\n",
  ],

  rules: {
    // TODO: ideally we shouldn't need this newline, a simple external scanner
    // may suffice.
    doxyfile: $ => repeat(seq(
      choice(
        $.comment,
        $.option,
      ),
      "\n",
    )),

    comment: $ => seq('#', field('body', $.comment_body)),
    comment_body:  _ => /[^\n]*/,

    option: $ => seq(
      field('key', $.identifier),
      choice('+=', '='),
      field('value', optional($.value)),
    ),
    value: $ => repeat1(choice($._ENL, $.literal)),

    identifier: _ => /[_a-zA-Z][_a-zA-Z0-9]*/,

    literal: $ => choice(
      $.boolean,
      $.number,
      $.quoted_string,
      $.unquoted_string,
    ),

    boolean: _ => choice('YES', 'NO'),
    number: _ => /\d+/,

    quoted_string: _ => /"[^"]*"/,
    unquoted_string: _ => /[^" \t\n\\]+/,

    _ENL: _ => seq("\\", token.immediate("\n")),
  }
});
