#Correctinator [![CircleCI](https://circleci.com/gh/koellemichael/correctinator/tree/master.svg?style=svg)](https://circleci.com/gh/koellemichael/correctinator/tree/master)

Ein Korrekturprogramm ([Download](#download)) mit Media Viewer für UniWorx Bewertungsdateien.


##Workflow
1. **Abgaben öffnen** - Es können mehrere Abgaben (komplettes Abgabenverzeichnis) oder nur eine einzelne Abgabe(Ordner einer einzelnen Abgabe) geöffnet werden
2. **Abgaben initialisieren** - Falls das Komentarfeld von einer oder mehreren Abgaben noch nicht initialisiert wurde, wird man aufgefordert dies zu tun. Nachtäglich kann dies mit der Funktion "Kommentarfeld initialisieren" gemacht werden. Die Initialisierung erfordert ein gewissen Aufgabenschema das im Abschnitt [Initialisierung des Komentarfelds](#initialisierung-des-komentarfelds)
3. **Korrigieren** - Die Bewertung wird automatisch aus der Summe der Bewertung der Unteraufgaben berechnet. Zusätzlich können Anmerkungen zu den Aufgaben in das jeweilige Komentarfeld der Aufgabe geschrieben werden. Für allgemeine Kommentare gibt es ein separates Kommentarfeld am Ende jeder Abgabe (hier werden auch die [Automatischen Kommentare](#automatischer-kommentar) eingefügt). Solange der Status der Abgabe auf "*TODO*" gesetzt ist, wird die Bewertung nicht in der Datei gespeichert (sie ist natürlich implizit vorhanden, da die Bewertungen der Unteraufgaben zu jeder Zeit gespeichert werden). Erst wenn der Status auf "*FINISHED*" gersetzt wird, wird die Bewertung gespeichert. Der Status "*FINISHED*" wird gesetzt, sobald "Speichern/Nächste Abgabe" gedrückt, oder explitzit der Status gesetzt wird.
4. **Markieren** - Es besteht die Möglichkeit, Abgaben zu markieren und eine Notiz hinzuzufügen. Markierte Abgaben muss man dann explizit über das Menü auf den Status "*FINISHED*" setzen, um sie abzuschließen.
5. **Zippen** - Sobald alle Abgaben den Status "*FINISHED*" erreicht haben, wird der Nutzer gefragt ob die Abgaben komprimiert werden sollen. Alternativ lässt sich der Dialog mit der Funktion "Als Zip exportieren" starten.



##Initialisierung des Kommentarfelds
Für die Vewendung des Programms ist die Initialisierung des Kommentarfelds nötig. Es muss ein Schema der Aufgaben angegeben werden.
Unteraufgaben werden mit Tabs eingerückt. Das Schema der Aufgaben im Kommentarfeld ist wie folgt:

\<**Aufgabenname**> [**:**|**)**] \<**Erreichte Punktzahl**>/\<**Maximale Punktzahl**>

Beispiel:

![alt text](https://i.ibb.co/WpRwxN8/Unbenannt.png "Beispiel Initialisierung")

##Einstellungen
- **Autosave**: Automatisches Speichern nach jeder Aktion
- **Cycle Files**: Im [Media Viewer](#media-viewer) wird nach der letzten Datei wieder die erste Datei einer Abgabe angezeigt
- **Automatisches Hochscrollen**: Scrollt automatisch zur ersten Aufgabe hoch nachdem man die Abgabe wechselt. Bezieht sich auf den Aufgabenbereich
- **Automatischer Kommentar**: Bei Änderung der Bewertung bzw. wechseln der Abgabe (momentan nur Button "Nächste Abgabe") wird zur Abgabe ein vordefinierter Kommentar abhängig von der erreichten Punktzahl hinzugefügt. Weitere Informationen im Abschnitt [Automatischer Kommentar](#automatischer-kommentar)
- **Verbose**: Zeigt nach dem Öffnen von Abgaben eine Zusammenfassung des Imports an.

###Media Viewer
- **PDF Viewer**: Es wird eine Beta Version der Open-Scource Library PDF.js verwendet. Es kann also zu Darstellungfehlern kommen. Wenn man sich nicht sicher ist, die Datei über die "Ordner öffnen" Funktion in einem anderen Viewer öffnen. Bei großen PDF-Dateien und PDF-Dateien die Bilder enthalten, kommt es zu etwas längeren Ladezeiten (je nach Leistung des PCs).
- **Image Viewer**: Man kann zoomen und dragen. Und es gibt Touchpad Support für Mac :)
- **Text Viewer**: Das Encoding wird nicht immer erkannt. Es gibt kein Text-Highlighting. Aus irgend einem Grund, gibt es einen Textumbruch, falls der Text länger ist als der Viewer.

###Automatischer Kommentar
Mit dieser Funktion können abhängig von der erreichten Punktzahl automatische Kommentare zur Abgabe hinzugefügt werden. Man kann Kommentare über den Menüpunkt "Automatischer Kommentar Einstellungen" definieren. Die Kommentare sollten jedoch nur einmal definiert werden. Beim Import von älteren Abgaben und einer veränderten Definition kann es zu doppelten Kommentaren kommen, da das Programm keinen Verlauf der bisherigen Kommentardefinitionen speichert.

#Download
[Correctinator Crossplattform Releases](https://github.com/koellemichael/correctinator/releases)