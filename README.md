# Correctinator ![Build/Release](https://github.com/koellemichael/correctinator/workflows/Build/Release/badge.svg)

A correction program ([Download](#download)) with media viewer for Uni2Work rating files.

![alt text](https://imgur.com/750Gbjf.png 'Correctinator')

## Workflow

1. **Import submissions** - You can import submissions via the home tab. You can import a single submission or multiple submissions at the same time. After importing they are grouped by exercise sheets.
2. **Initialize submissions** -
   After the successful import, the submissions must be initialized. The initialization assigns a task structure to an exercise sheet. This structure can then be used to do the corrections later. Learn more about schema generation [here](#Initialize-submissions).
3. **Correction** - The score is automatically calculated from the sum of the sub-tasks' scores. In addition, comments on the tasks can be written in the respective comment field of the task. For general comments there is a separate comment field at the end of each submission. The status of the correction will be set to "Done" as you click on the "Next" button.
4. **Mark corrections and take notes** - It is possible to mark submissions and add a note. Marked deliveries must be explicitly reset in order to complete them.
5. **Export to zip** - Once all the submissions have reached the "Done" status, you will be asked if the submissions should be exported and compressed as a .zip file. In the Export Dialog you can set the output path and adjust [conditional comments](#conditional-comments).

## Initialize submissions

Submissions must be initialized with a task schema. The schema generator is used for this purpose. First select one of your imported exercise sheets. then you can add as many tasks and subtasks as you like to the schema. Make sure that the score matches the score on the exercise sheet. Here you can also assign a default comment or the initial score for each task. You can also adjust the step size for the score of the task. after you have created the schema, you can assign it to the sheet by clicking on the "Assign" button.

Example:

![alt text](https://imgur.com/MuYfHJ8.png 'Example schema')

## Media Viewer

- **PDF Viewer**
- **Image Viewer**
- **Text Viewer**/**Code Viewer with Highlighting**

## Conditional Comments

With this function, conditional comments can be added to the correction depending on the achieved score. You can define three comments via the Export Menu Dialog.

## Light/Dark Mode

You can decide if you come over to the dark side or get blinded by the light (theme).

![alt text](https://imgur.com/hQwRSTT.png 'Example schema')

## Download

[Releases (Win, Mac & Linux)](https://github.com/koellemichael/correctinator/releases)

### Legacy

There is a legacy version of the correctinator based on java. All releases until [v0.6.0](https://github.com/koellemichael/correctinator/releases/tag/0.6.0) are legacy.
