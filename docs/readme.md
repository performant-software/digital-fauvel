README.TXT
digitalfauvel repository

Written by Alison Y. Chang, August 2013

Contains:
DigitalFauvel (inside SurfaceApplication1) – the C# code for the Microsoft Surface 2.0. Open in Visual Studio or other C# environment. Main class is SurfaceWindow1.xaml, and its code-behind is SurfaceWindow1.xaml.cs (get to it by clicking into the second SurfaceApplication1 folder, nested in the first).

Note: THIS WILL NOT RUN IN ITS CURRENT STATE. Due to copyright issues, this repository cannot include the XML, audio, or visual files that are specific to Roman de Fauvel and used in DigitalFauvel. The following folders and their contents are missing: pages, smallpages, thumbnails, icons, XML, and musicz. If you are part of the Princeton DigitalFauvel team, you may have access to our Dropbox, where most of these resources can be found.
Our repository is primarily intended to be an example of a digital humanities project. However:

TO RUN THIS PROJECT, create the following folders at the same level of the bin, obj, Properties and Resources folders:

1. XML - Contents: XML files (see XMLGuide.txt for more info). Our project has four: OriginalTextXML, ModernFrenchXML, EnglishXML, and LayoutXML.
2. icons - Contents: numerous icons (.jpg, .png) used on buttons in our project, such as downArrow, search, exLarge, leftArrow, loading, etc.
3. pages - Contents: full size image (.jpg) scans of the Fauvel manuscript. We have images numbered from 10 to 105.
4. smallpages - Contents: small versions of the pages, used for the slider bar/as temporary images until the full pages load.
5. thumbnails - Contents: one thumbnail per object (poetry, music, image) in Fauvel (.jpg). 
6. minithumbnails - Contents: mini versions of all the thumbnails for images (aka miniatures) in Fauvel.
7. music - Contents: score (.png) and audio (.wma) files for music objects in Fauvel.

Then, open the project solution in Visual Studio and you can either publish it before running it, or just debug, build, and run it in Visual Studio.

XMLGuide.txt – an explanation to understanding, creating, and using Content and Layout XML documents for Fauvel.

Content XML Encoders: 
EnglishXML.java – used to create EnglishXML file. 
ModFrEncoder.java – used to create ModernFrenchXML file. 
TextReader.java – used to create OriginalTextXML file. This was the first Encoder program written for Fauvel. 
Instructions.txt – readme for TextReader.java. 

Each of the three above programs reads a .txt file and prints to another. The latter is valid XML. The actual XML documents cannot be included in this repository due to copyright.
NOTE: These programs were written for our very specific original files (Strubel edition of Roman de Fauvel with original and Modern French text; Eliza Zingesser's translation of Fauvel). They will not magically transform ANY document into valid XML.
Use them as an example of how to efficiently encode documents into XML.

Music.java – defines a music object for ModFrEncoder and TextReader.
TableOfContents.java – lists objects found on each folio using the XML file created by the other programs.

Layout XML Encoders:
evenspace.py – Bonnie Eisenman’s python script for line by line image recognition. Not currently used by any other code.
jdc-findlines.py – Jamie Chong’s python script for getting line by line coordinates, assuming even spacing in a column of text.
LineFinder.java – creates the LayoutXML file by allowing a user to open a folio’s image and click corners of objects. Read LineFinder_instructions for more info.
Coordinate.java – defines a coordinate object for LineFinder.java.


Challenges.txt – a description of some XML encoding, user interface, and search capability designs encountered in the creation of Digital Fauvel.

NextSteps.txt – some of the important next steps for Digital Fauvel, both general and specific to the search capabilities.

FauvelQuirks.txt – a list of quirky elements discovered in the text from Fauvel.

MusicSidebarDocumentation.txt – a guide to the music (Study Tab) sidebar.

