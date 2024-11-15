const API_ENDPOINT = "http://localhost:9092/callEvents";

interface EventCommonProperties {
  callingNumber: string;
  calledNumber: string;
  tntId: string;
  virtualReceptionistId: string;
  ucxSuiteTag: string;
  callId: string;
  origId: string;
  ts: number;
}

type CallEventType =
  | "start"
  | "terminated"
  | "abandoned"
  | "monthlyQuotaExceeded"
  | "intentNotRecognized"
  | "intentRecognizedCallTransferByName"
  | "phoneticSearchResult"
  | "phoneticSearchResultKo"
  | "intentRecognizedFaq"
  | "faqAnswerOk"
  | "faqAnswerKo"
  | "inputNotRecognized"
  | "fallbackHangup"
  | "fallbackReturnToMainMenu"
  | "returnedToMainMenu"
  | "fallbackTransfer"
  | "transfer"
  | "callTransferred"
  | "fallbackAskToLeaveAMsg"
  | "msgLeft";

interface CallEvent {
  callingNumber: string;
  calledNumber: string;
  tntId: string;
  virtualReceptionistId: string;
  ucxSuiteTag: string;
  callId: string;
  origId: string;
  ts: number;
  callEvent: CallEventType;
  additionalInfo?: Record<string, any>;
}

const generateRandomCallId = (): string =>
  `${Math.floor(Math.random() * 100000)}`;
const getCurrentTimestamp = (): number => Date.now();

const createEvent = (
  callId: string,
  origId: string,
  callEvent: CallEventType,
  additionalInfo: any = {}
): CallEvent => {
  return {
    callingNumber: "123456789",
    calledNumber: "987654321",
    tntId: "12-34567-89",
    virtualReceptionistId: "789",
    ucxSuiteTag: "10.10.10.10",
    callId,
    origId,
    ts: getCurrentTimestamp(),
    callEvent,
    additionalInfo,
  };
};

const sendEvent = async (event: CallEvent): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Failed to send event. Status: ${response.status}`);
    }
    console.log(`Event sent: ${JSON.stringify(event.callEvent)}`);
  } catch (error) {
    console.error(`Failed to send event: ${(error as any).message}`);
  }
};

const generateEventFlows = (): CallEvent[][] => {
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

const getRandomFlowParallel = (): CallEvent[] => {
  const flows = generateEventFlows();
  return flows[Math.floor(Math.random() * flows.length)];
};

const simulateEventFlowParallel = async (flowId: number): Promise<void> => {
  const events = getRandomFlowParallel();
  console.log(`Starting flow ${flowId} with ${events.length} events.`);
  for (const event of events) {
    await sendEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay between events
  }
  console.log(`Flow ${flowId} completed.`);
};

const simulateMultipleFlows = async (numFlows: number): Promise<void> => {
  const flowPromises = Array.from(
    { length: numFlows },
    (_, index) => simulateEventFlowParallel(index + 1) // Pass a unique flow ID
  );
  await Promise.all(flowPromises);
};

// Main simulation
const mainParallel = async (): Promise<void> => {
  const args = process.argv.slice(2); // Get CLI arguments
  const numClients = parseInt(args[0], 10); // Parse the first argument as the number of clients
  if (isNaN(numClients) || numClients <= 0) {
    console.error(
      "Please provide a valid number of clients as a CLI argument."
    );
    process.exit(1);
  }
  await simulateMultipleFlows(numClients);
  console.log(`All ${numClients} flows have been completed.`);
};

mainParallel();
