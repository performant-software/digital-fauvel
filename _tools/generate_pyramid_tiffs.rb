#!/usr/bin/env ruby

CURRENT = File.expand_path(File.dirname(__FILE__))
PATH = '../_assets/test'
INPUT_DIR = 'tiffs'
OUTPUT_DIR = 'ptifs'

source_files = Dir["#{CURRENT}/#{PATH}/#{INPUT_DIR}/*"]

source_files.each { |source_file| 
  output_file_name = source_file.match(/\/([\d]+\.tiff)/)[1]
  output_file_path = "#{CURRENT}/#{PATH}/#{OUTPUT_DIR}/#{output_file_name}"
  system("convert #{source_file} -define tiff:tile-geometry=128x128 -compress jpeg 'ptif:#{output_file_path}'")
}
