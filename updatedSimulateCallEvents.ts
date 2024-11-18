const generateEventFlowsParallel = (): CallEvent[][] => {
  const callId = generateRandomCallId();
  const origId = callId;

  return [
    // Flow 1: FAQ Answer Success
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "intentRecognizedFaq", {
        transcription: "What are the hours?",
        question: "opening_hours",
      }),
      createEvent(callId, origId, "faqAnswerOk", {
        answer: "10:00 to 18:00",
        kbName: "opening_hours",
        kbSource: "store_info_kb",
      }),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 2: Transfer Attempt Fails
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "intentRecognizedCallTransferByName", {
        transcription: "I want to speak to John.",
        labelToSearch: "John",
      }),
      createEvent(callId, origId, "phoneticSearchResultKo"),
      createEvent(callId, origId, "fallbackTransfer"),
      createEvent(callId, origId, "callTransferred", {
        destination: "+123456789",
      }),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 3: Successful Phonetic Search and Transfer
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "phoneticSearchResult", {
        resultList: [
          { firstName: "John", lastName: "Smith", phoneNumber: "123456789" },
        ],
      }),
      createEvent(callId, origId, "transfer", { destination: "+123456789" }),
      createEvent(callId, origId, "callTransferred", {
        destination: "+123456789",
      }),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 4: User Input Not Recognized
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "inputNotRecognized", {
        transcription: "Unintelligible speech",
      }),
      createEvent(callId, origId, "fallbackReturnToMainMenu"),
      createEvent(callId, origId, "returnedToMainMenu"),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 5: Monthly Quota Exceeded
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "monthlyQuotaExceeded"),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 6: User Leaves a Voice Message
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "fallbackAskToLeaveAMsg"),
      createEvent(callId, origId, "msgLeft", {
        originalTranscription: "Hi, please call me back.",
        formattedTranscription: "Hi, please call me back.",
        contact: { firstName: "John", lastName: "Doe", number: "123456789" },
        destination: "john.doe@example.com",
      }),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 7: Intent Not Recognized
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "intentNotRecognized"),
      createEvent(callId, origId, "abandoned"),
    ],
    // Flow 8: Immediate Hangup
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "abandoned"),
    ],
    // Flow 9: Recognized Transfer by Name
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "intentRecognizedCallTransferByName", {
        transcription: "Transfer to John.",
        labelToSearch: "John",
      }),
      createEvent(callId, origId, "callTransferred", {
        destination: "+123456789",
      }),
      createEvent(callId, origId, "terminated"),
    ],
    // Flow 10: Fallback Hangup After Silence
    [
      createEvent(callId, origId, "start"),
      createEvent(callId, origId, "inputNotRecognized", {
        transcription: "...",
      }),
      createEvent(callId, origId, "fallbackHangup"),
      createEvent(callId, origId, "terminated"),
    ],
  ];
};

const getRandomFlow = (): CallEvent[] => {
  const flows = generateEventFlowsParallel();
  return flows[Math.floor(Math.random() * flows.length)];
};

const simulateEventFlowUpdated = async (): Promise<void> => {
  const events = getRandomFlow();
  for (const event of events) {
    await sendEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay between events
  }
};

// Simulate multiple call flows
const mainUpdated = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) {
    await simulateEventFlow();
  }
};

mainUpdated();
