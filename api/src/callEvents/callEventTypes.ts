export type CallEventType =
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
  | "askedToLeaveAMsg"
  | "msgLeft";
