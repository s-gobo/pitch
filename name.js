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
        if (chord.delete("maj")) {
          chord.add("aug");
        } else {
          chord.add("aug5");
        }
      } else if (dim5()) {
        if (chord.delete("min")) {
          chord.add("dim");
        } else {
          chord.add("dim5");
        }
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
    
    // 6ths
    
    let maj6 = () => intervals.delete(9);
    
    if (!chord.has("7") && !chord.has("maj7") && !chord.has("dim") && maj6()) {
      chord.add("6");
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
  }
  
  // rank chords
  const componentRanking = {
    "C": 0, "C#": 0.01, "D": 0, "D#": 0.01, "E": 0, "F": 0, "F#": 0.01, "G": 0, "G#": 0.01, "A": 0, "A#": 0.01, "B": 0,
    maj: 1, min: 2, no3: 15, aug: 10.1, dim: 10, aug5: 23.2, dim5: 23, no5: 14,
    7: 4, min7: 4, 6:12,
    9: 4, min9: 4,
    11: 4, min11: 4,
    13: 4, min13: 4,
    no9: 19,
    sus2: 11, sus4: 10.5,
    addb2: 56,
    add2: 40,
    addb3: 55,
    add4: 40,
    addb5: 52,
    addb6: 58,
    add6: 50,
    add7: 50,
  }
  const nameOrder = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "maj", "min",
    "aug", "dim",
    "7", "min7", "6",
    "9", "min9",
    "11", "min11",
    "13", "min13",
    "sus2", "sus4",
    "aug5", "dim5",
    "no9", "no3", "no5",
    "addb2",
    "add2",
    "addb3",
    "add4",
    "addb5",
    "addb6",
    "add6",
    "add7",
  ];
  
  let re = [];
  for (let chord of chords) {
    let score = 0;
    for (let component of chord) {
      score += componentRanking[component];
    }
    if (chord.has("dim") || chord.has("aug")) {
      if (chord.has("sus4") || chord.has("sus2") || chord.has("no3")) {
        score += 80;
      }
    }
    
    let string = "";
    for (let name of nameOrder) {
      if (chord.has(name)) {
        string += name;
      }
    }
    
    re.push({chord:chord, score:score, name:string});
  }
  
  return re;
}

let re = name(["C", "E", "G", "B", "D"]);
console.log(re);
let a;