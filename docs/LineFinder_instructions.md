instructions on using LineFinder

(mostly specific to digitalfauvel)

(*0. MAKE SURE YOU HAVE LATEST VERSION OF LINEFINDER, so pull)
1. Run LineFinder from the repository. You may have to compile it first, so the commands to use are:

javac LineFinder.java
java -Xmx6g LineFinder

2. A window should pop up, and from there click File->Open
3. Find the folder of formatted folio images you have on your disk
4. Choose the correct number.jpg: I will be giving you the first and last numbers you should be using along with their corresponding folio numbers, keep track on your own for the middle.
-->The command line will then ask for the folio number. Enter the number and then 'r' or 'v' with a SPACE IN BETWEEN. After you enter, the folio image will display in the window.
5. Helpful hint: open up the same .jpg file in preview or whatever image viewing program you have and zoom in to make sure you're looking at the right content. compare with Alison's XML content file (on the dropbox) to confirm ID's, line numbers, etc.
6. When you are ready to save a bounding box, click the type on the bottom of the window (text, music, or image)
7. In the terminal, it should be asking you for a name. After you had the image displayed, the command line should have outputted a list of objects found on this page.
!!!If there are errors: (blame Strubel, and then) let me know! I will look it over for you instead!!!
8. Type in the correct ID from the list for this object. Then, click the upper left corner of the box. Then, click the bottom right corner of the box. Pleeeeeaaassseee don't do it in the other order, or things will get very weird.
9. A white box outline should show up. Confirm that you think this box is sufficient, and then press "save object". The command line will ask you to confirm. If you made a mistake, type 'n' or some gibberish. If you want this box saved, type 'y' and the program will save this box to the file.
10. Continue with other objects.
11. In the event that one object requires more than one bounding box, save each box separately as if it were an individual box, BUT make sure to:
- save these boxes one after another (i.e. don't save some other object in between)
- use the same exact ID for each box
12. When you're done with all the objects on the folio, press 'done w/ this folio'. Confirm by typing 'y' to the command line and then you can continue with the next folio. If you can, please complete the folios in order. It's not impossible to fix but it'll be much easier if you do it in order.
13. If you ever need to restart the program, make sure to stash your existing layout.txt file beforehand or you will lose your work.

14. When you are all done, send me the .txt files you have made (it can be more than one, if you ran the program more than once). Don't worry about the content, I'll be double checking things.

Ask me if you are confused!