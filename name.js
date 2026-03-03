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
    
    // 7ths
    
    let dim7 = () => intervals.delete(9);
    let maj7 = () => intervals.delete(10);
    let min7 = () => intervals.delete(11);
    
    if (chord.has("dim") && dim7()) {
      chord.add("7");
    } else if (min7()) {
      if (chord.has("dim")) {
        chord.add("min7")
      } else {
        chord.add("7")
      }
    } else if (maj7()) {
      chord.add("maj7")
    }
    
    // 9ths
    
    let maj9 = () => intervals.delete(2);
    
    if (chord.has("7") && !chord.has("dim")) {
      if (maj9()) {
        chord.delete("7");
        chord.add("9");
      }
    } else if (chord.has("maj7")) {
      if (maj9()) {
        chord.delete("maj7");
        chord.add("maj9");
      }
    }
    
    // 11ths
    
    let prf11 = () => intervals.delete(5);
    
    if (chord.has("9") && prf11()) {
      chord.delete("9");
      chord.add("11");
    } else if (chord.has("maj9") && prf11()) {
      chord.delete("maj9");
      chord.add("maj11");
    }
    
    // 13ths
    
    let maj13 = () => intervals.delete(9);
    
    if (chord.has("11") && maj13()) {
      chord.delete("11");
      chord.add("13");
    } else if (chord.has("maj11") && maj13()) {
      chord.delete("maj11");
      chord.add("maj13");
    } else if (chord.has("7") && !chord.has("dim")) {
      if (intervals.has(5) && intervals.has(9)) {
        prf11();
        maj13();
        
        chord.delete("7");
        chord.add("13");
        chord.add("no9");
      }
    } else if (chord.has("maj7")) {
      if (intervals.has(5) && intervals.has(9)) {
        prf11();
        maj13();
        
        chord.delete("maj7");
        chord.add("maj13");
        chord.add("no9");
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
    
    // maj is implied
    chord.delete("maj")
    
    sheets.push(intervals);
  }
  return [...chords[0]].join("");
}

let re = name(["C", "E", "G", "B", "D"]);
console.log(re);
let a;