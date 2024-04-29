##### Wie sich LLMs Programmieren lassen #LIQUID-Jumivortrag

[[Kaskadirende Referenzen]], 
```
<SYSTEM>
Wissen und Texte, die komplett aus der Datenbank kommt, und von dem USER Prompt-Abschnitt durch explizite und implizite Referenzen du Artikeln bestimmt wird. Das können Informationen, Geschichten, Instruktionen sein, et cetera. Wenn Kaskadierende Referenzierung aktviert ist, werden hier auch (indirekte) Referenzen aufgelöst. Es bildet sich eine wichtigkeit bestimmter Artikel ab, die bestimmt, wie groß der anteil der Artikel im system Prompt it.
</SYSTEM>


<USER>
Wissen, das Komplett vom USER Bestimmt ist. Das können Informationen, Geschichten, Instruktionen sein, et cetera. Bei einem Auto Agent wird dieser Teil des Prompts sebst von einer oder mehreren LLM geschrieben oder regelmäßig angepasst.
</USER>

<ASSISTANT>
Ein Teil des Textes, den der AGENT bisher geschrieben hat. An diesen Text soll die Antwort des LLM angehängt werden.
</ASSISTANT>

```