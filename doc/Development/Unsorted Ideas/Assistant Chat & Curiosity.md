# Vorhersagen und document retrieval
Benutze billiges llm um chatverlauf "vorherzusagen", dann mit dem billigen llm und anhand des existierenden und vorhergesagten chatverlaufs schätzen welche Informationen und Artikel nachgeschlagen werden müssen.
Pro Artikel: ""

# Interceptors & Kommandozeile
Man kann der Kommandozeile inerceptoren zuschalten. Jeder Prompt in der Kommandozeile wird dann, bevor er an das finale llm geschickt wird von jedem Interceptor im Stack durchleuchtet. Dabei kann der Interceptor den Prompt ignorieren (Pass), oder abfangen (Tamper). Nach dem Abfangen kann der Rest vom Stack abgearbeitet werden, nochmal von ganz oben angefangen werden oder der Prompt abgebrochen werden.

# Interceptor-Stack
Für jeden Interceptor kann kann die Ausführungshäufigkeit ausgewählt werden "Always"/"Sometimes"/"Never"
Bei "Sometimes" kann dann eine Triggerbedingung programmiert werden. Der Interceptor kann dann den Inhalt des System Prompt beliebig ändern.


# anderes
Um so weiter "hinten" im Prompt, um so geringer die Curiosity für die Artikel.
Um So geringer die curiosity für einen Artikel, um so geringer die Anzahl an Informationen aus diesem Artikel die für den nächsten Prompt in der Kette geladen werden.
Fast alle Worte des ersten Satzes werden behandelt als wären sie von \[\[\]\] umgeben. Ein \[\[solches\]\] wort bekommt fast immer eine gute curiosity wenn es einen Artikel referenziert.