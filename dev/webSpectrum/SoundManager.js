
    //  global variables

    var context;        //  sound context
    var loadCount = 0;  //  file loading listener
    var source;         //  source of audio
    var buffer;         //  buffer for our source
    var volumeNode;     //  amplify the sound..

    // Object to analyze sound (and store values in an array)
    var analyser;

    // Step 1 - Initialise the Audio Context
    // There can be only one!
    function initSounds() 
    {

        console.log("init");
        if (typeof AudioContext == "function") 
        {
            context = new AudioContext();
        } 
        else if (typeof webkitAudioContext == "function") 
        {
            context = new webkitAudioContext();
        } else 
        {
            alert('Web Audio API is not supported in this browser. \nPlease use latest version of Google Chrome \nor go and drink some tea');
            throw new Error('AudioContext not supported. :(');
        }
        analyser = context.createAnalyser();
    }

    // Step 2: Load our Sound using XHR
    function startSound(name) 
    {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        console.log("requested");
        request.open("GET", name, true);
        request.responseType = "arraybuffer";
        
        // Our asynchronous callback
        request.onload = function() 
        {
            var audioData = request.response;
            audioGraph(audioData);
            loadCount++;
            if(loadCount==1)
            {
                finishLoad();
            }
        };
        request.send();
    }

    // Finally: tell the source when to start
    function playSound(outputsound) 
    {
        // play the source now
        outputsound.noteOn(context.currentTime);
    }

    function stopSound(index) 
    {
        source.noteOff(context.currentTime);
    }

    function audioGraph(audioData) 
    { 
        source = context.createBufferSource();
        buffer = context.createBuffer(audioData, true);
        source.buffer = buffer;
        source.loop = true;

        volumeNode = context.createGainNode();
        volumeNode.gain.value = 1;

        source.connect(volumeNode);
        volumeNode.connect(context.destination);
        volumeNode.connect(analyser);
        playSound(source);
    }

   
   

    


