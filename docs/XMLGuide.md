## GUIDE TO FAUVEL XML FILES

Alison Y. Chang, Summer 2013

- Content XML files - (Primary encoder: Alison Y. Chang): OriginalTextXML, encoded from Fauvel ed. Strubel PDF using TextReader.java
- ModernFrenchXML - encoded from Fauvel ed. Strubel PDF using modified TextReader.java
EnglishXML - encoded from Eliza Zingesser’s translation using modified TextReader.java

- Layout XML files - (Primary encoder: Jamie Chong): LayoutXML encoded using LineFinder.java

- Prior work: 
	- Data Representation for the Digital Fauvel - Alan Thorne
	- findlines.py (bitbucket repository) - Bonnie Eisenman

_______

### Explanation of Content XML tags and attributes:

- `cp` - counterpart. Indicates the music object extends over more than one page. Inner text is the tags of the other parts of the same object.
- `dc` - dropcap. Denotes a drop cap (larger/embellished) letter in text.
- `figDesc` - figure description. Caption for a miniature (image) in Fauvel.
- `figure` - miniature (image) in Fauvel. Includes sub-tag “figDesc” holding the caption.
- `firstcp` - first counterpart of an object with multiple parts. See “cp”.
- `id` -  attribute for poetry/music/image that has the object’s tag as its value.
- `l` -  line. Denotes a line of poetry. Grouped within “lg”. 
- `lg` -  line group. Denotes group of poetry lines, grouped as seen on page in Fauvel.
- `n` -  number. Line number attribute for poetry line (“l”). Continuous and incrementing throughout the entirety of Fauvel.
- `notatedMusic` -  notated music. Denotes the visual coordinate spots of a music object. The lyrics go in a separate tag - “p”. 
- `nv` -  number of voices. Used in motets (music object w > 1 voice).
- `p` - Denotes the lyrics of a music object. The “p” tag’s “id” attribute ends in “_t”, indicating “text” - lyrics of the music.
- `pb` facs -  page break(?), facsimile. Denotes the start of a new page. Value of attribute “facs” is the page number.
- `pn` -  page number. Denotes a line of poetry’s number on that given page. Starts over - from 1 at the start of every page.
- `ptr` - refer to Alan Thorne’s paper on TEI and XML. 
- `rubrique` -  a type of text, separate from poetry and text. 
- `text` -  Denotes a type of text within Fauvel. Includes rubriques.
- `title` -  Title of a piece of music. Appears at the start of each counterpart of a multi-part music object.
- `v` -  voice. Denotes a voice within a motet (multi-voice/polyphonic music). Can include attribute “part” which indicates voice part - i.e. triplum, duplum, tenor.
- `vcp` -  voice counterpart. Denotes voice that stretches across more than one page.

### Explanation of Layout XML tags and attributes:

- `box` - Holds coordinates for object on a page - poetry, music, or image. 
- `graphic` - Included in first “zone” tag of each page (“surface”); denotes the image linked to that page in the “url” attribute.
- `id` - Denotes tag of an object (poetry, music, image) or a page. Poetry tags start with “Te”, image tags include “Im” followed by a number, and music tags include an abbreviation for the music type - i.e. “Mo” for Motet or “Con” for Conductus.
- `l` - A line of poetry. Lines are included within the “zone” and “box” that have the id value of the entire group of lines.
- `lrx` - Lower right x coordinate of a rectangle drawn around an object.
- `lry` - Lower right y coordinate of a rectangle drawn around an object.
- `n` - Line number for a line of poetry; continuous/incremental throughout entire poem.
- `pn` - Line number on that page for a line of poetry; restarts at 1 on each new page.
- `surface` - Marks a page of Fauvel. Attribute “id” has its page number, which includes a number and either “r” or “v” (recto or verso).
- `ulx` - Upper left x coordinate of a rectangle drawn around an object.
- `uly` - Upper left y coordinate of a rectangle drawn around an object.
- `url` - Attribute of “graphic” tag that specifies the image name linked to that page.
- `zone` - Marks off separate objects on each page (“surface”). The first zone on each page/”surface” denotes the image for that entire page. The others correspond to objects on that page.

______

### Guidelines for encoding new translation:

#### Concepts behind our encoding process -

- Content files: Keep as simple as possible, primarily copy + paste text from PDF (and proof read). Human adds lines like “STARTPOEM” or “ENDMUSIC” to mark boundaries of objects. Computer then reads in this .txt file, interprets the additional boundary indicators and wraps each object with the appropriate tags. For things like line numbers, # of each music object per page, etc, check which start from 1 on each page and which increment throughout the manuscript.
- Layout files: GUI allows user to open image (i.e. of a page of a manuscript) and enter page number. Console lists the objects expected on that page number. User clicks object type, enters its tag (listed by console), and clicks twice - top left corner and bottom right. Computer records the coordinates/object accordingly, making sure to start and close each page as images are loaded / closed.

#### Tips for XML Navigation

Also refer to Search.cs from digitalfauvel repository

Imports:

```
using System.Xml;
using System.Xml.Schema;
using System.Xml.XPath;
```

Create a new XML Document - 

Declare and then load using relative/absolute path:

```
XmlDocument engXml = new XmlDocument();
engXml.Load(@"..\..\XML\EnglishXML.xml"); 
```

Select a single node from the XML - i.e. w a certain String called “tag”:

`XmlNode singleNode = engXml.DocumentElement.SelectSingleNode(“//zone/box[@id='" + tag + "']”);`

You need to select the XML file as a DocumentElement. The method SelectSingleNode takes in an “XPath” - the “//” before zone means that this <zone> tag could appear at any level in the document; it is a relative path instead of an absolute one. Note that using a double slash will always go back to the start of the document and find the very first occurrence of that tag! “zone/box” means that the <box> tag is a child tag (nested inside) of the <zone> tag. The [@id] etc means that you are looking for the <box> tag with the id attribute value of the given String tag. It looks a bit messy bc of the concatenation of the String tag, but if the tag were “1rMo1”, the full XPath would be: “//zone/box[@id=’1rMo1’]”.

#### Select several nodes

`XmlNodeList myNodes = engXml.DocumentElement.SelectNodes("//lg/l[@n>=3 and @n<=8"]");`

This time, you use an XmlNodeList instead of just an XmlNode. Here, we are selecting the lines of poetry (<lg> means line group, which has many <l> lines within) with attribute n (line number) ranging between 3 and 8. 

To enter the start and end line numbers as ints firstLine and lastLine, call:

`.SelectNodes("//lg/l[@n>="+firstLine+"and @n<="+lastLine+"]");`


#### Other methods

Let’s say you have an XML node called “myNode” which consists of this:

```
<zone>
<box n=“1”>
I’m the first box!
</box>
<box n=“2”>
I’m the second box!
</box>
<box n=“3”>
<babyBox>
Hello! I’m the child of a box!
</babyBox>
</box>
</zone>
```

Here are some handy methods:

To select the first box -
`XmlNode firstBoxNode = myNode.FirstChild;`

To print the value of the “n” attribute of each box - 

```
XmlNodeList boxes = myNode.SelectNodes(“/box”);
foreach(XmlNode xn in boxes)
{
Console.Write(xn.Attributes[“n”].Value);
}
```

To get the text inside a tag, i.e. the first box  - 

```
String myStr = myNode.FirstChild.InnerText;
myStr would equal “I’m the first box!”
```

If you’re worried about whitespace at the start or end of the string, call Trim():

```String myStr = myNode.FirstChild.InnerText.Trim();```

To print all the XML inside a tag - i.e. the last box
```Console.Write(myNode.LastChild.InnerXml);```

To find out which box has tags inside -

```
XmlNodeList myBoxes = myNode.SelectNodes(“/box”);
foreach(XmlNode node in myBoxes)
{
if(node.hasChildNodes == true)
{
// doSomething();
}
}
```

To get rid of the <babyBox> tag -

```
XmlNode lastBox = myNode.LastChild;
XmlNode newNode = lastBox.RemoveChild(lastBox.LastChild); 
```

Other tips:
```XML Validator - http://www.w3schools.com/xml/xml_validator.asp ```


