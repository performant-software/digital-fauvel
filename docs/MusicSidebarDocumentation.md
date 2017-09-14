MUSIC SIDEBAR DOCUMENTATION
Jamie Chong, August 2013

This is a guide on getting to know the music (STUDY) section of the sidebar.

Preparing files to use:

MuseScore is a free musical notation software and I’m pretty sure it’s usable on all operating systems. Download and install it. There is a fully functioning online handbook if you are really stuck on anything. For the purposes of this project alone, here are some basic steps once you have the scan of the modern musical notation* in front of you:
create a new score but DO NOT put anything in the title/composer/etc. fields.
for parts, I usually just add a basic “voice” (you can edit, or get rid of, the name later) and if I need more than one, just press enter more than once (however many voices you need for this piece). You can edit clefs later as well, so don’t worry about that now.
choose your time signature according to what the scan you have says, and then whatever key signature (usually no sharps or flats).
choose any arbitrary number of measures for now, since you can always add or subtract them later. If you really want to make your life easier, however, you can just look at your scan and count.
click done.
INSERTING NOTES - shortcuts!!!:
N key - start inserting or stop inserting notes (it toggles on/off)
6 key - half note
5 key - quarter note
4 key - eighth note
3 key - sixteenth note
backspace - erase what you just inserted
A, B, C, D, E, F, G keys - respective notes
command (or ctrl, I’m guessing on windows) + up/down arrow - go up or down and octave
simple up/down arrow - move selected note up or down by half step
left/right arrow keys - move selection bar left or right (you can tell where you are currently selecting by what is highlighted in blue)
it is EASIEST and simplest when you are able to simply go from left to right and insert each note in order. MuseScore is sometimes annoying for users when you start trying to edit in between things, so just GO IN ORDER. If you mess up, it’s probably best to just start over (or if you can, backspace your errors away)
You can add things like tremolos, slurs, and change time/key signatures from the side bar. You can change the direction of the note stem on the upper right corner (there is a button).
To edit voice names, right click on the voice name and choose Properties. There are two text boxes, one for full voice name and another shortened one used on subsequent lines. Edit them however you like or erase the name altogether (if the voice has no name which is often the case).
Adding lyrics:
select the first note and press command + L. A text window should show up.
type in lyrics, keeping in mind that the window skips to the next available not EACH TIME you press SPACE or DASH. Use dash for obvious reasons (when the word isn’t finished yet) and space otherwise. If a space or dash extends over more than one note, press it again until the text window shows up under the note that has the next lyrics.
to stop typing lyrics, click away. To edit existing lyrics, double click on the text.
When you are DONE:
save, and then click “Save As...” two different times: one time, save as a PNG file, another time, save it as a WAV file.
add the PNG file to the project folder.
convert the WAV to a WMV somehow (there are alot of simple online converters) and put the WMV file in the project folder.

→ ALSO: when making individual voice parts for the polyphonic pieces, go to File-->Parts... and a window will show up. Click “new part” and then add the part you want, then “Create” and it will make a separate file for you. Only do this when you are sure you have no more editing to do of the score!

!!! Open up the project and press Refresh on the Solution Explorer. When the new files show up, right click on the WMV file and choose Properties. THEN set “Don’t copy” to “Copy Always”. This is VERY important because otherwise the audio file won’t play.

^ The above procedure is what we have to live with until another solution comes up. It can be really hard to be accurate sometimes but try your best.

*you can get a copy of the monophonic music in modern notation from this book:
Rosenberg & Tischler, Monophonic Songs in the Roman de Fauvel (call number in Princeton University Mendel Music Library is M2.M655 1991
for polyphonic music, we have scans in the Digital Fauvel Dropbox, or if you don’t have access to that the book is:
Leo Schrade, Le Roman de Fauvel


The format for the current music page is the full title of the piece at the top, the play/pause and stop buttons right underneath, and the drop down menu for MIDI of Live Recording playback choices next to that. Underneath everything we have a tab window, with the biggest tab for displaying the modern notation. The other two tabs provide translated lyrics in Modern French and English.

If the selected piece is monophonic, the modern notation tab has the music simply displayed (if need be, we also have a scroll bar).
If the piece of polyphonic, there are collapsible panels for the Full Score, and then subsequently each part individually in their own panels. So you can either look at a single voice on its own, or look at the full score.
Each individual voice panel also has Mute and Solo buttons on their headers for playback adjustments as desired by the user. These buttons are disabled, however, if you have chosen to listen to the Live Recording, as this is much harder to separate into different voices.

If both MIDI and a Live Recording is available for this particular piece of music, the drop down menu shows “Select audio” and the play/pause/stop buttons are not enabled until you choose one. If there is only one choice, however (usually just MIDI), the menu will open to that choice and the play/pause/stop buttons will be ready to play that audio.

When a piece of music is polyphonic, each voice is played through a separate MediaPlayer object. This may cause sync/delay issues but for the most part it is usually fine. It is also more convenient because of the ability to mute and solo while the piece is playing (though doing that often may cause the voices to become un-synced).



Future steps:

As of now, we have one sample monophonic piece of music and one sample polyphonic piece of music. When there are more pieces of music to choose from, it is probably best to have the MediaPlayer object be initialized and opened only once the user chooses that particular piece, not beforehand when the project opens up or when they choose the Study tab, because that would take a very long time. Right now I have the objects declared outside the methods and initialized/opened inside the methods, which isn’t too far off. But it may be hard (and unnecessary) to have a separate variable for every single piece of music declared beforehand.

Right now, there are two simple buttons on the initial Study tab page that direct you to sample pages. In the end, the goal is to have the simple message show, and then the user selects a piece of music on the folio itself. The program then detects which piece of music this is (from the layout XML identifying the coordinates the user has selected) and presents the modern notation and translated lyrics in the format established in the pages already made.

Another issue is when you have already selected a piece of music, but then you select another one. In this case, the application should make another music tab with the new piece of music opened.

When a piece of music has been selected, it would be useful to have an indication of some sort that this piece of music has a tab open. This could be a slight shading, or highlighting, or simply a noticeable border; whatever works visually.

This indicator should also be a button of some sort that will re-open the corresponding music tab, should you have navigated away from it. Vice versa, the tab itself should be able to navigate back to the location of the music in the folio (perhaps making a new folio tab with the correct pages opened). I am thinking this button could be the title box at the top of the tab.

Another useful function would be to have a playback bar on the musical notation that will show you where you are in the music when the audio is playing. This would be more easily implemented in MIDI but would not be impossible with the live recordings. In order for this visual to exist, we may have to think about implementing music XML to display our notation rather than image files. (MuseScore also exports in music XML so this would not be a huge problem).

Another option that was brought up during the meeting on Monday was the possibility of having a toggle button for displaying barlines. Since the original music does not have barlines or key signatures, getting rid of those could be useful for musicologists and other people interested.
Again, this would require some sort of music XML implementation.



