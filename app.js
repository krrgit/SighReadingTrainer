import {synthInit, synthHandleInput, synthUpdateVol} from './synth.js';

const startButton = document.querySelector('button');
const volumeSlider = document.querySelector('input');

startButton.addEventListener('click', synthInit)

volumeSlider.addEventListener('input', () => {
    synthUpdateVol(volumeSlider.value/volumeSlider.max);
})

// Check for MIDI Access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function success (midiAccess) {
    console.log(midiAccess);
    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs;
    console.log(inputs);

    inputs.forEach((input) => {
        console.log(input);
        input.addEventListener('midimessage', handleInput);
    });
}

function failure() {
    console.log("Could not connect MIDI");
}

function updateDevices (event) {
    console.log(event);
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`);
}

function handleInput(input) {
    synthHandleInput(input);
}