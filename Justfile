# The currently targeted ABI version
TREE_SITTER_ABI_VERSION := '14'

# By default list all recipes
default:
    @just --list --unsorted

# Generate the parser
generate:
    tree-sitter generate \
        --abi {{TREE_SITTER_ABI_VERSION}}

# Run the test suite
test *args: generate
    tree-sitter test {{args}}

# Initialize the repo for development
init: generate
    pnpm install
