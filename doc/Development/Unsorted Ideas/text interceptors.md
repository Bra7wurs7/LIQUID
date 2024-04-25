# Interceptors & Kommandozeile
Man kann der Kommandozeile inerceptoren zuschalten. Jeder Prompt in der Kommandozeile wird dann, bevor er an das finale llm geschickt wird von jedem Interceptor im Stack durchleuchtet. Dabei kann der Interceptor den Prompt ignorieren (Pass), oder abfangen (Tamper). Nach dem Abfangen kann der Rest vom Stack abgearbeitet werden, nochmal von ganz oben angefangen werden oder der Prompt abgebrochen werden.

# Interceptor-Stack
Für jeden Interceptor kann kann die Ausführungshäufigkeit ausgewählt werden "Always"/"Sometimes"/"Never"
Bei "Sometimes" kann dann eine Triggerbedingung programmiert werden. Der Interceptor kann dann den Inhalt des System Prompt beliebig ändern.
