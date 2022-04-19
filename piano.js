// Handles all the code for the piano visualizer
const piano = document.getElementById('piano');

let id;

function drawPiano()
{
    id = 21;
    piano.innerHTML = '';
    for(let i=0;i<7;++i){
        piano.innerHTML += drawKeys(12);
    }
    // draw end
    piano.innerHTML += drawKeys(4);
}

function drawKeys(amount) {
    let value ='';
    for (let i=0;i<amount;++i)
    {
        value += '<div class="' + getKeyToDraw(i) + '" id="key' + id + '"></div>';
        ++id;
    }
    return value;
}

function getKeyToDraw(index) {
    // 0 = A key
    switch(index) {
        case 1:
        case 6:
            return 'keyb keybr';
        case 4:
        case 9:
            return 'keyb keybl';
        case 11:
            return 'keyb keybc';
        default:
            return 'keyw';
    }
}

function pianoHandleInput(input){
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    switch(command) {
        case 144: // noteOn
            if (velocity > 0) {
                // note is on
                noteOn(note);
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

function noteOn(note) {
    let key = document.getElementById('key'+note);
    key.className += "-pressed";
}

function noteOff(note) {
    let key = document.getElementById('key'+note);
    key.className = key.className.split('-')[0];
}

export {drawPiano, pianoHandleInput}