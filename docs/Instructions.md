/********************************************************************************
* Alison Y. Chang (ayc2135) - Fauvel PDF
* Java program created to transform text from Strubel PDF to XML Content File.
* Instructions Document
*********************************************************************************/

Files included:
  Fauvel.txt - The text pasted/formatted from Strubel PDF
  FauvelEdited.txt - What the TextReader program creates from Fauvel.txt
  Music.java - Defines the "Music" object
     See makeMusicGenres() method in TextReader.java for complete list of existing Music objects
  TextReader.java - Transforms Fauvel.txt to FauvelEdited.txt by adding XML markup.
  Tester.java - The main class. RUN THIS ONE.



INSTRUCTIONS FOR COPY + PASTE FROM PDF TO .TXT
1) No headings or footnotes.
2) LEFT pages only.
3) Include folio indications as independent lines that mark page break (Fo3, Fo3r, or Fo3v).
4) Don't worry about line numbers/blank lines; leave in what's naturally pasted.
5) Check line breaks. 
6) "Miniature # (description)", "Priere", and "Rubrique ..." should be on A SINGLE LINE.
7) Bolded capital letters = drop caps. Add "X-" right before the full word:
	i.e. "F- Favellandi vicium", "(Duplum) P- Presidentes", or "105 L- Le pape se"
8) For chunk of poetry, add "STARTPOEM" and "ENDPOEM" as separate lines before/after.
9) For music, add "ENDVOICE" after each voice and "ENDMUSIC" at the end - all as independent lines.
      Refer to makeMusicGenres() method in TextReader.java to check for all types of music.
      Identify voices by (Duplum), etc. markings or when the next line has bolded first letter.
      Make sure to add "ENDVOICE" after single-lined Tenor parts too!
10) Check for spelling errors or extra symbols like random dots (bc of OCR error).
11) Ignore:
	 Parenthetical italicized lines outside of poetry/music like "(Fin de...)" or "(Suite...)"
	 Things like (L.3270)
	 Column markings - i.e. Fo3a, Fo28b, or Fo30c




Feel free to view the existing Fauvel.txt document for examples.






INSTRUCTIONS FOR CHECKING XML-TAGGED OUTPUT
1) Each data type (poem, music, miniature) is identified correctly.
   Make sure that each music type is being abbreviated correctly too!
2) Line numbers match up at start and end of each section.
3) Folio page breaks are being found (i.e. switch from Fo3 to Fo3v).
4) If anything is wrong/looks strange, check your input text file. 
   If you still can't solve it, ask me (Alison)! :)