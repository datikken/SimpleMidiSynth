import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const init = () => {
  var context = new AudioContext(),
  oscillators = {};

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
  }

  function success (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
  }

  function failure () {
    console.error('No access to your midi devices.')
  }

  function onMIDIMessage (message) {
    var frequency = midiNoteToFrequency(message.data[1]);

    if (message.data[0] === 144 && message.data[2] > 0) {
        playNote(frequency);
        console.log(frequency);
    }

    if (message.data[0] === 128 || message.data[2] === 0) {
        stopNote(frequency);
    }
  }

  function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
  }

  function playNote (frequency) {
    oscillators[frequency] = context.createOscillator();
    oscillators[frequency].frequency.value = frequency;
    oscillators[frequency].connect(context.destination);
    oscillators[frequency].start(context.currentTime);
  }

  function stopNote (frequency) {
    oscillators[frequency].stop(context.currentTime);
    oscillators[frequency].disconnect();
  }

}

init();

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
      <h1>Hello</h1>
  </Layout>
)

export default IndexPage
