let  playBeat = () => {
    let audio = document.getElementById("beat");
    audio.play()
}

let playPage = () => {
    let audio = document.getElementById("page");
    audio.play()
}
let playOnoff = () => {
    let audio = document.getElementById("onoff");
    audio.play()
}
let playButton = () => {
    let audio = document.getElementById("button");
    audio.play()
}

let playNumber = () => {
    let audio = document.getElementById("number");
    console.log(audio)
    setTimeout(() => {
        // audio.play()
    }, 20);
}
let playError = () => {
    let audio = document.getElementById("error");
    audio.play()
}

export {
    playBeat, playPage, playOnoff, playButton, playNumber, playError
}