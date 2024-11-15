const eventCommonProperties = {
  callingNumber: "123",
  calledNumber: "456",
  tntId: "12-34567-89",
  virtualReceptionistId: "789",
  ucxSuiteTag: "10.10.10.10",
  callId: "987",
  origId: "654",
  ts: 1725020799123,
};

type CallEventType =
  | "start" // origId === callId new call, origId !== callId call reentered, failed transfer
  | "terminated" // by VR
  | "abandoned" // by User
  | "monthlyQuotaExceeded" // play of a default message and hangup
  | "intentNotRecognized"
  | "intentRecognizedCallTransferByName" // recognized the transferee by name
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
  | "askedToLeaveAMsg"
  | "msgLeft";

const callTransferByNameEvent = {
  ...eventCommonProperties,
  callEvent: "intetRecognizedCallTransferByName",
  additionalInfo: {
    transcription: "I would like to talk to John Smith",
    labelToSearch: "John Smith",
  },
};

const phoneticSearchResultEvent = {
  ...eventCommonProperties,
  callEvent: "phoneticSearchResult",
  additionalInfo: {
    resultList: [
      { firstName: "John", lastName: "Smith", phoneNumber: "123456789" },
    ],
  },
};

const phoneticSearchResultKOEvent = {
  ...eventCommonProperties,
  callEvent: "phoneticSearchResultKo", //not found match, or more than one match and VR has been configured to use only one match
};

const intentRecongizedFaqEvent = {
  ...eventCommonProperties,
  callEvent: "intentRecognizedFaq",
  additionalInfo: {
    transcription: "I would like to know which are the opening hours",
    question: "opening_hours", //label extracted from transcription to be used as search query in the knowledge base
  },
};

const faqAnserOkEvent = {
  ...eventCommonProperties,
  callEvent: "faqAnswerOk",
  additionalInfo: {
    answer: "The opening hours are from 10:00 to 18:00",
    kbName: "opening_hours", //the key of the JSON source file
    kbSource: "store_info_kb", //the name of the source file
  },
};

const faqAnswerKoEvent = {
  ...eventCommonProperties,
  callEvent: "faqAnswerKo", //no answer found
  additionalInfo: {
    kbName: "opening_hours",
  },
};

const inputNotRecognizedEvent = {
  ...eventCommonProperties,
  callEvent: "inputNotRecognized", // the user input was not understood, maybe because there was silence, or because the user says something out of the scope of the knowledge base
  additionalInfo: {
    transcripiton: "what the result of 2+2?",
  },
};

const fallbackHangupEvent = {
  ...eventCommonProperties,
  callEvent: "fallbackHangup", // --> after that will arrive "terminated" event or "abandoned", if the caller will hangup before the VR
};

const fallbackReturnToMainMenuEvent = {
  ...eventCommonProperties,
  callEvent: "fallbackReturnToMainMenu", //--> after that will arrive "returnedToMainMenu", or abandoned
};

const returnedToMainMenuEvent = {
  ...eventCommonProperties,
  callEvent: "returnedToMainMenu",
};

const fallbackTransferEvent = {
  ...eventCommonProperties,
  callEvent: "fallbackTransfer", // after that will arrive "callTransferred" event
};

const transferEvent = {
  ...eventCommonProperties,
  callEvent: "transfer", // transfer to a destination that is not a contact found by phenetic search API, after taht callTransferred event will arrive
  additionalInfo: {
    destination: "+39 3344444444",
  },
};

const callTransferredEvent = {
  ...eventCommonProperties,
  callEvent: "callTransferred", // the successful transfer outcome
  additionalInfo: {
    destination: "+39 3344444444",
  },
};

const fallbackAskToLeaveAMsgEvent = {
  ...eventCommonProperties,
  callEvent: "fallbackAskToLeaveAMsg", // fallback to leave an email message in the contact voice mail
};

const msgLeftEvent = {
  ...eventCommonProperties,
  callEvent: "msgLeft",
  additionalInfo: {
    originalTrascription: "hmm, Hi mario, ehm... how are you?",
    formattedTranscription: "Hi mario, how are you?",
    contact: {
      firstName: "Mario",
      lastName: "Rossi",
      number: "334 4444",
    },
    destination: "mario.rossi@acme.com",
  },
};
