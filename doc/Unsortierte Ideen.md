##### 09.10.24
- Tippen im Prompter gibt automatisch vorschau der promptergänzung (Zeigt gesamte End-Prompt an, sowie Artikel mit deren hilfe die Prompts gebaut wurden und deren "Wichtigkeit" bzw. "Aufmerksamheit")
- Artikelname!llmname

##### LLM Technologie Allgemein
- Wenn LLM ein Wort schreibt, wirkt sich dieses wort auf sein nächstes Autoprompt aus. Ein Wort zu schreiben, zu beeinflussen bedeutet gewissermaßen immer ein Wort zu lesen, wahrzunehmen. Actuator vs Sensor.
- Ein LLM kann auch temporär schreiben, also ein schreiben das sich nicht auf unsere Umwelt auswirkt

## Grundsätze
##### Jede Schaltfläche, jedes Feature ist auch vom KI-Agenten nutzbar. Das wird dadurch implementiert, dass jedes feature eine 
##### Möglichst alles open source, aber auch die proprietären Services leicht nutzbar machen, die gerade die beste Performance liefern.

##### So wenige clicks wie irgend nötig für jede Aktion, ohne Auswirkungen zu automatisieren

##### Erweiterung von Markdown. Formatierung vom Text beeinflusst
# Versionen
##### V1.0.0:
- Alle dateien werden links gelistet und können über ein Zahnrad in der Seitenleiste, oder mit der Inputleiste gefiltert werden
- Alles wird links gelistet, weil alles was irgendwie existiert eine datei ist.
- Eine Datei kann geöffnet werden, dann wind sie in der mitte, unter wer werkzeugleiste eingelistet und hervorgehoben 

##### V0.5.0
- Ab version 0.5 soll Liquid in der Lage sein, sich selbst in Rust zu übersetzen, mit der nutzung von nur Lokalen LLMs.
	- Das heißt auch, dass fast nur noch funktionale programmierkonzepte verwendet werden.

##### V0.3.0: 
- Seamless GIT-Clone Integration
	- Laden eines Git-Repo via http
##### V0.2.0:
- 100% TUI Integration für bestehende GUI Elemente


# Datenmodell Nicht-Unique Artikelnamen
- die Articlemap mappt jetzt <string, Article\[\]>, denn Artikel müssen keinen einzigartigen Namen haben solange ihre Namensvetterartikel andere Kategorien haben.

# GUI

- Popup vom über Workspace selektor hovern der die artikel namen anzeigt
- Workspaces werden geadded wie in gnome, es gibt immer einen zu viel
- Workspaces an Files "anknüpfen"
- Knowledgebase, Article, Category können anders heißen, z.B.
- Mindmap, Leaf, Node

# Anderes

- Namen müssen nicht unique sein, solange sie sich in mindestens/genau einem abstrakten Konzept (Gruppenname) unterscheiden.

Adventure mit Grafik, beide AI:
- Es ist sinnvoll, dass LLMs auf der CPU laufen, während Stable Diffusion auf der GPU läuft, zumindest für ein Text Adventure mit Grafik.
- Eventuell hat jede von der KI angelegte Datei eine gewisse Lebensdauer, die jedesmal erneuert und verlängert wird wenn sie "angesehen" wird.

- Jeder Bildschirmrand hat Bedienelemente die Panels von diesem Bildschirmrand öffnen und beeinflussen können
- die mittleren Karten verbinden sich visuell mit dem Rechten Panel
- Das Rechte Panel bezieht sich nur auf die Aktuell betrachtete Notiz
- Jedes Panel verbindet sich visuell mit seinem Ursprung.

##### Nachschlagealgorithmus


## WhatDoesUserWant
## XMostImportantWords
${User Prompt}
- What are the X most important words of the user prompt, when it comes to functionally following orders given by the user.
- What are the X most important words of the user prompt, when it comes to understanding what they want to tell or teach us about something.
- What are the X most important words of the user prompt, when it comes to teaching or telling them about something.
- ...