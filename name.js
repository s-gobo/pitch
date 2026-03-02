const allNotes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const setToString = s => JSON.stringify([...s]);

const name = (notes) => {
  let sheets = [];
  let chords = [];
  for (let note of notes) {
    let chord = new Set([note]);
    chords.push(chord);
    
    // get intervals
    let intervals = new Set();
    let offset = allNotes.indexOf(note);
    for (let otherNotes of notes) {
      let diff = allNotes.indexOf(otherNotes) - offset;
      
      // modulo
      diff %= 12;
      diff += 12;
      diff %= 12;
      
      intervals.add(diff)
    }
    
    // console.log(note, setToString(intervals));
    
    // root
    intervals.delete(0);
    
    let min3 = () => intervals.delete(3);
    let maj3 = () => intervals.delete(4);
    
    // third
    if (maj3()) {
      chord.add("maj");
    } else if (min3()) {
      chord.add("min");
    } else {
      chord.add("no3");
    }
    
    let dim5 = () => intervals.delete(6);
    let prf5 = () => intervals.delete(7);
    let aug5 = () => intervals.delete(8);
    
    if (!prf5()) {
      if (aug5()) {
        chord.delete("maj")
        chord.add("aug");
      } else if (dim5()) {
        chord.delete("min")
        chord.add("dim");
      } else {
        chord.add("no5");
      }
    }
    
    // sustains
    
    let prf4 = () => intervals.delete(5);
    let prf2 = () => intervals.delete(2);
    
    if (chord.has("no3")) {
      if (prf4()) {
        chord.delete("no3");
        chord.add("sus4");
      } else if (prf2()) {
        chord.delete("no3");
        chord.add("sus2");
      }
    }
    
    // 7ths
    
    // TODO
    
    // adds
    
    const addNames = [
      "root",
      "b2",
      "2",
      "b3",
      "3",
      "4",
      "b5",
      "5",
      "b6",
      "6",
      "7",
      "#7",
    ];
    
    for (let interval of intervals) {
      chord.add("add" + addNames[interval]);
    }
    
    sheets.push(intervals);
  }
  return [...chords[0]].join("");
}

let re = name(["C", "E", "G"]);
console.log(re);
let a;