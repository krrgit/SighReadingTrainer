// Handles all the code for creating the synth sounds

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let ctx;
let volume = 1;
const oscillators = {};

// Other Functions
function synthInit() {
    ctx = new AudioContext();
    console.log(ctx);
}

function synthUpdateVol(value) {
    volume = value;
    Object.values(oscillators).forEach(val =>{
        val.osc.gain.gain.exponentialRampToValueAtTime(calcGain(val.velocity,volume), ctx.currentTime + 0.1);
    });
}

// Utility functions
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function miditoFreq(number) {
    const a = 440;
    return (a / 32) * (2 ** ((number - 9) / 12));
}

function calcGain(velocity, volume) {
    return clamp(0.33 * volume * (velocity / 127), 0.0001, 1);
}

// Synth functions
function synthHandleInput(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    switch(command) {
        case 144: // noteOn
            if (velocity > 0) {
                // note is on
                noteOn(note, velocity);
            } else {
                //note off
                noteOff(note);
            }
            break;
        case 128: // note off
            noteOff(note);
            break;
        default:
            break;
    }
}

function noteOn (note, velocity) {
    const osc = ctx.createOscillator();
    
    const oscGain = ctx.createGain();
    oscGain.gain.value = calcGain(velocity, volume);
    
    osc.type = 'sine';
    osc.frequency.value = miditoFreq(note);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.gain = oscGain;
    const oscillator = {osc, velocity};
    oscillators[note.toString()] = oscillator;
    
    osc.start();
}

function noteOff(note) {
    const osc = oscillators[note.toString()].osc;
    const oscGain = osc.gain;

    oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime + 0.03);

    setTimeout(() => {
        osc.stop();
        osc.disconnect();
    }, 30);

    delete oscillators[note.toString()];
}

// Exxport variables and functions
export {synthInit, synthHandleInput, synthUpdateVol};