#!/usr/bin/env ruby

INPUT_DIR = 'tiffs'
OUTPUT_DIR = 'ptifs'

source_files = Dir["#{INPUT_DIR}/*"]

source_files.each { |source_file|
  output_file = "#{OUTPUT_DIR}/#{source_file.match(/\/(\S+)/)[1]}"

  system("convert #{source_file} -define tiff:tile-geometry=1024x1024 -depth 8 -compress jpeg 'ptif:#{output_file}'")
}
