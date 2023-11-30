# README
Last Update 13.09.23
What is LIQUID and what will it be?
- Eine Software zum besonders effizienten Speichern, Verarbeiten und Abrufen von Informationen
- A multi-user AI Database interface
- A natural language database graphical user interface
- An object oriented database graphical user interface
- A tool for keeping quick notes, synchronized between devices
- A beginner-friendly GIT file-browser with article versioning
- A native browser-application based on firefox that can break out of the browser sandbox.
- A fully open source git based drag and drop cloud service
- A downpour (markdown) writer, formatter and parser
- A universal AI API frontend connecting to any text-to-image api, text-to-text (llm) api, text-to-speech api and perhaps many more
- Fun to use!

LIQUID Uses ANGULAR as a basic framework, PRIMENG and PRIMEFLEX to speed up the implementation of a reactive user interface.
SIMPLE-GIT can be used for implementing a noob-friendly git client to allow for article synchronization and versioning with a "cloud" style simplicity of use. FLITE can be used for giving a voice to the AI assistants.





1. As a GM Using LIQUID, I want to be able to use an AI Assistant, whom I can tell to do stuff in my notebook, what \[\[Notes\]\], and what {{Attributes}} to use etc.
2. Perhaps I want to automatically detect all names that are 
3. As a GM Using LIQUID, I want to quickly and efficiently **write and link notes**
4. As a GM Using LIQUID, I want to **categorize** and **organize** Notes
	- Each Note can belong to one or more categories
	- Each category has it's own folder in the Notes tab, The folder root is for "uncategorized" notes 
	- When categorizing notes, I want to define attribute fields that are shared by all notes of the category
	- I want to be able to define if and where in my note an attribute is displayed in what way. I want to able to easily (re)create stat-tables and abstracts.
	- When editing a note, I also want to sal
5. As a GM using LIQUID, I want to be able to **generate** content using AI and Random Dice-Roll Tables
	- I want to define Random Tables with entries for dice results and the resulting events. I want to be able to simulate rolls on this table
	- I want to define AI-Prompts using string templates that are filled with attribute values
	- I want to attach (AI/Dice Table) Generators to fields of categories (notes) so I can fill that field with generated content.
	- When attaching AI generators to category fields, I want to select what attributes of the notes of this category should be used as template input for the generator.
	- I want to be able to define constructors for categories, that use one (the name) or many input parameters to quickly generate a whole note (NPC/Monster/Location etc)
	- I want to transform a statblock provided by the AI in a Human-readable format into a Software-readable Format, it will probably be necessary to define a transformer prompt for every category that adheres to the category. The transformer prompt can be generated from the category attributes defined in the category. "bring what you just wrote into a format adhering to the following JSON structure: ..."

- Rename "Views" To "Workspaces"

Notes
Innerhalb von Notes kann jede Prompt/Request bzw. Überschrift/Unterschrift Kombo von KI generiert werden. Absolut jedes Inputfeld kann auch von einer KI gefüllt werden, dabei hat jedes inputfeld seinen eigenen "base prompt" der dann automatisiert, oder vom nutzer manuell mit inputs erweitert werden kann. Dabei hat der Generator einige Mindestvoraussetzungen, die durch die Hierarchie 

You can attach Prompts to Categories. Notes remember prompts and answers. Prompts can be re-run

Generate Adventure Workflow:
- Define Adventure Name
- Define Adventure Keywords / Generate Adventure Keywords from adventure Name
- Generate names of potentially Involved NPCs, discovered Locations, Mysteries to discover