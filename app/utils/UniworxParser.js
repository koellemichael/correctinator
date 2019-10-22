import { SUBMISSION_STATES } from '../constants/submission';
import Comment from '../model/Comment';
import Task from '../model/Task';
import Rating from '../model/Rating';
import orm from "../orm";
import SubmissionCorrection from "../model/SubmissionCorrection";
import {store} from "../index";
import {createSubmissionCorrection, openSubmissions} from "../actions/actionCreators";

export function parse(content, directory, ratingFile, files) {
  const session = orm.session();
  // https://regex101.com/r/MgTRms/2
  const regex = new RegExp("= Bitte nur Bewertung und Kommentare ändern =\n"
    + "=============================================\n"
    + "========== UniWorx Bewertungsdatei ==========\n"
    + "======= diese Datei ist UTF8 encodiert ======\n"
    + "Informationen zum Übungsblatt:\n"
    + "Veranstaltung: (.+)\n"
    + "Blatt: (.+)\n"
    + "Korrektor: (.+)\n"
    + "E-Mail: (.+)\n"
    + "Abgabe-Id: (.+)\n"
    + "Maximalpunktzahl: (\\d+[.|,]?\\d*).*\n"
    + "=============================================\n"
    + "Bewertung: (\\d*[.|,]?\\d*).*\n"
    + "=============================================\n"
    + "Kommentare:\n"
    + "\\s*((?:(?:(?:[^\\n]*[:|)])\\s*(?:\\d+[,|\\.]\\d+|\\d+)\\/(?:\\d+[,|\\.]\\d+|\\d+))\\s*\\n?(?:^(?:\\t+[^\\t\\n]+\\n*))*\\s*)*\\s*)\\s*(.*?)\\s*(?:\\/\\*(.*)\\*\\/)?\\s*"
    + "============ Ende der Kommentare ============",'gm');

  const match = regex.exec(content);
  const correction = {state: SUBMISSION_STATES.TODO};

  if(match){
    const [ , lectureName, exerciseName, correctorName, correctorEmail, submissionId, maxPoints, score, tasks, commentText, annotation] = match;

    if(score.trim() !== ""){
      correction.state = SUBMISSION_STATES.FINISHED;
    }

    if(annotation){
      correction.state = SUBMISSION_STATES.MARKED_FOR_LATER;
    }

    if(tasks === "\n" || tasks.trim().length === 0){
      correction.state = SUBMISSION_STATES.NOT_INITIALIZED;
    }

    const corrector = {name: correctorName, email: correctorEmail.toLowerCase()};
    console.log(session.Corrector.create({name: correctorName, email: correctorEmail.toLowerCase()}));
    const lecture = {name: lectureName};

    const exercise = {name: exerciseName, maxPoints: extractFloatFromString(maxPoints), lectureId: lecture};
    const submission = {id: submissionId, filePaths: files, exerciseId: exercise};
    const exerciseRating = {score: extractFloatFromString(score), taskId: exercise, correctorId: corrector, submissionId: submission, comment: {text: commentText}};

    correction.annotation = annotation;
    correction.ratingFilePath = ratingFile;
    correction.filePaths = files;
    correction.exercise = exercise;
    //correction.ratings = parseTasks(tasks, corrector, lecture, submission, [exerciseRating], exercise);

    //const data = normalize(correction, submissionCorrectionSchema);
    session.SubmissionCorrection.create(correction);
    store.dispatch(createSubmissionCorrection(correction));
    //console.log(session.SubmissionCorrection.create(correction));
    //console.log(denormalize(0, correctionSchema, data.db))
  }else{
    correction.state = SUBMISSION_STATES.PARSE_ERROR;
  }

  return correction;
}

export function stringify() {
  return "TEST";
}

function extractFloatFromString(s){
  const regex = new RegExp("(\\d+[.|,]?\\d*)");
  const match = regex.exec(s);
  if(match){
   return parseFloat(match[1].replace(',','.'))
  }
}


function parseTasks(contents, corrector, lecture, submission, ratings = [], parent = undefined) {
  const regex = new RegExp("(?=(?:^[^\\s][^:|)]*[:|)])\\s*(?:\\d+[,|\\.]\\d+|\\d+)\\/(?:\\d+[,|\\.]\\d+|\\d+))", 'gm');

  if(contents === undefined){
    return ratings;
  }

  const ratingsSplit = contents.split(regex);

  if(!ratingsSplit){
    // TODO: File not initialized
  }

  ratingsSplit.forEach(subRating => {
    const r = parseTask(subRating, corrector, lecture, submission, parent);
    r.task.parent = parent;

    if(parent !== undefined && parent.subTasks){
      parent.subTasks.push(r.task)
    }
    ratings.push(r);

    if(countSubtasks(subRating)>1){
      parseTasks(unwrapParentTask(subRating), corrector, lecture, submission, ratings, r.task);
    }

  });

  return ratings;
}

function unwrapParentTask(content){
  let lines = content.split('\n');
  lines.splice(0,1);
  lines = lines.map(line => line.substring(1));
  return lines.join('\n');
}

function parseTask(contents, corrector, lecture, submission, parent = undefined){
  // https://regex101.com/r/G1jcxf/2
  const regex = new RegExp("(?: |\\t)*([^\\n]+[:|)])\\s*(\\d+[,|\\.]\\d+|\\d+)\\/(\\d+[,|\\.]\\d+|\\d+)[\\t| ]*\\n?(\\t*\\S.*)?", 'gms');

  const match = regex.exec(contents);
  let comment = "";

  if(countSubtasks(contents)<=1 && match[4]){
    let lines = match[4].split('\n');
    lines = lines.map(line => line.substring(1));
    comment = lines.join('\n');
  }

  const r = new Rating(
    extractFloatFromString(match[2]),
    undefined,
    new Task(match[1], extractFloatFromString(match[3]), parent, []),
    corrector,
    submission
  );

  r.comment = new Comment(comment, r);

  return r;

  /*
  return {
    score: extractFloatFromString(match[2]),
    comment: {text: comment},
    task: {name: match[1], maxPoints: extractFloatFromString(match[3]), subTasks: []},
    subRatings: []
  }
*/
  /*
  return {
    name: match[1],
    rating: {
      score: extractFloatFromString(match[2])
    },
    maxpoints: extractFloatFromString(match[3]),
    comment: {
      text: comment
    },
    subtasks: []
  };
  */
}


function countSubtasks(str){
  const re = new RegExp("( |\\t)*(.+[:|)])\\s*(\\d+[,|\\.]\\d+|\\d+)\\/(\\d+[,|\\.]\\d+|\\d+)", 'gm');
  return ((str || '').match(re) || []).length
}

/*
public static void parseExercises(String exercises, Exercise parent) throws ParseRatingFileCommentSectionException, FileNotInitializedException {
  Pattern patternTest = Pattern.compile("(?m)^[^\\r\\t\\f\\v].*", Pattern.MULTILINE);
  Pattern patternExercise = Pattern.compile("( |\\t)*(.+[:|)])\\s*(\\d+[,|\\.]\\d+|\\d+)\\/(\\d+[,|\\.]\\d+|\\d+)");

  String[] exerciseSplit = splitWithDelimiters(exercises, patternTest.pattern());

  if(exerciseSplit.length == 0){
    throw new FileNotInitializedException();
  }

  for(String s : exerciseSplit){
    int count = countPatternInString(s, patternExercise);
    if(count > 1) {
      Exercise e = parseExercise(s, parent.getCorrection());
      Scanner scanner = new Scanner(s);

      StringBuilder newS = new StringBuilder();

      while (scanner.hasNextLine()){
        String line = scanner.nextLine();
        if(line.startsWith("\t")){
          newS.append(line.substring(1)).append("\n");
        }
      }

      if(parent != null){
        parent.addSubExercise(e);
      }
      e.setParent(parent);
      parseExercises(newS.toString(),e);
    }else{
      Exercise e = parseExerciseRating(s, parent.getCorrection());
      if(parent != null){
        parent.addSubExercise(e);
      }
      e.setParent(parent);
    }
  }
}

public static int countPatternInString(String input, Pattern pattern){
  return input.split(pattern.toString(),-1).length - 1;
}

public static ExerciseRating parseExerciseRating(String plain, SubmissionCorrection c) throws ParseRatingFileCommentSectionException {
  Pattern patternExercise = Pattern.compile("( |\\t)*(.+[:|)])\\s*(\\d+[,|\\.]\\d+|\\d+)\\/(\\d+[,|\\.]\\d+|\\d+)");
  Scanner lineScanner = new Scanner(plain);
  String line;
  if(lineScanner.hasNext()){
    line = lineScanner.nextLine();
    Matcher matcher = patternExercise.matcher(line);
    if(matcher.find()){
      ExerciseRating  e = new ExerciseRating();
      e.setCorrection(c);
      e.setName(matcher.group(2));
      e.setRating(Double.parseDouble(matcher.group(3).replace(",",".")));
      e.setMaxPoints(Double.parseDouble(matcher.group(4).replace(",",".")));

      while (lineScanner.hasNext()){
        String l = lineScanner.nextLine();
        if(l.startsWith("\t")){
          e.setComment(e.getComment()+ l.substring(1) +"\n");
        }
        else{
          e.setComment(e.getComment()+ l +"\n");
        }
      }

      return e;
    }
  }

  throw new ParseRatingFileCommentSectionException(plain);
}

public static Exercise parseExercise(String plain, SubmissionCorrection c) throws ParseRatingFileCommentSectionException {
  Pattern patternExercise = Pattern.compile("( |\\t)*(.+[:|)])\\s*(\\d+[,|\\.]\\d+|\\d+)\\/(\\d+[,|\\.]\\d+|\\d+)");
  Scanner lineScanner = new Scanner(plain);
  String line;
  if(lineScanner.hasNext()){
    line = lineScanner.nextLine();
    Matcher matcher = patternExercise.matcher(line);
    if(matcher.find()){
      Exercise  e = new Exercise();
      e.setCorrection(c);
      e.setName(matcher.group(2));
      return e;
    }
  }

  throw new ParseRatingFileCommentSectionException(plain);
}

 */
