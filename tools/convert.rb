#!/usr/bin/env ruby
require 'nokogiri'
require 'erb'
require 'pry'

INPUT_DIR = '_assets/xml'
TEMPLATE_DIR = 'tools'
OUTPUT_DIR = '_data/list'
DOMAIN = "fauvel.archivengine.com"
LANGUAGES = ['english','french','original']

class AnnotationList
  include ERB::Util
  attr_accessor :template, :domain, :language, :folio, :output_path, :annotations

  def initialize(options, annotations)
    @domain = options[:domain]
    @language = options[:language]
    @folio = options[:folio]
    @output_path = options[:output_path]
    @template = File.read(options[:template_path])
    @annotations = annotations
  end

  def render
    ERB.new(@template).result(binding)
  end

  def save
    File.open(@output_path, "w+") do |f|
      f.write(render)
    end
  end
end

# Open the layout file which describes the annotated regions
layout = File.open("#{INPUT_DIR}/layout.xml") { |l| Nokogiri::XML(l) }

# For each language
LANGUAGES.each do |language|
  # Open the #{language} annotation source file
  source_file = File.open("#{INPUT_DIR}/#{language}.xml") { |s| Nokogiri::XML(s) }
  # Go through the full layout listing, one folio at a time
  layout.css('surface').each do |folio|
    # Set up an annotation list file per folio, in the correct language folder
    output_path = "#{OUTPUT_DIR}/#{language}/#{folio.attribute("id").text}.json"
    template_path = "#{TEMPLATE_DIR}/list.json.erb"
    folio_key = folio.attribute("id").text

    # Set up global options for the list
    list_options = {
      domain: DOMAIN,
      language: language,
      folio: folio_key,
      template_path: template_path,
      output_path: output_path
    }

    # Set up an array of annotations
    annotations = []

    # Go through each zone
    folio.css('zone').each do |zone|
      case zone.attribute("id")
      # Pick out the ones which contain blocks of text...
      when /Te_\d+\-\d+/
        # Then go through each line of that text block...
        zone.css('l').each do |line|
          annotation = {
            language: language,
            folio: folio_key,
            domain: DOMAIN,
          }
          # Box location and dimensions
          x = line.attribute('ulx').value.to_i
          y = line.attribute('uly').value.to_i
          w = line.attribute('lrx').value.to_i - x
          h = line.attribute('lry').value.to_i - y
          annotation['xywh'] = "#{x},#{y},#{w},#{h}"

          # Line number
          line_no = line.attribute('n')
          selector = 'l[n="' + line_no + '"]'

          # Annotation content
          body = source_file.at(selector).text.strip.gsub(/\"/, '\"')
          annotation['text'] = %(#{body})

          # Add it to the array
          annotations.push(annotation)
        end
      end
    end

    # Create the list and write out the list file
    list = AnnotationList.new(list_options, annotations)
    list.save()
  end
end

__END__
#   Te
#   An
#   Ba
#   Chn
#   Chs
#   Com
#   Con
#   Ex
#   Fa
#   Im
#   La
#   Mo
#   Pr
#   Ref
#   Rep
#   Ro
#   Rub
#   Ve
#   Vi
