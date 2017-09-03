#!/bin/sh
mkdir -p syntax/
mkdir -p ~/.vim/syntax/


node generator.js > syntax/cloudformation.vim

cp syntax/cloudformation.vim ~/.vim/syntax/

